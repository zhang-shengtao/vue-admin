class TypedRingBuffer {
  constructor(TypedArrayClass, initialCapacity = 4096) {
    this.TypedArrayClass = TypedArrayClass;
    this.buffer = new TypedArrayClass(initialCapacity);
    this.start = 0;
    this.length = 0;
  }

  ensureCapacity(requiredLength) {
    if (requiredLength <= this.buffer.length) {
      return;
    }
    let nextCapacity = this.buffer.length;
    while (nextCapacity < requiredLength) {
      nextCapacity *= 2;
    }
    const nextBuffer = new this.TypedArrayClass(nextCapacity);
    for (let index = 0; index < this.length; index += 1) {
      nextBuffer[index] = this.get(index);
    }
    this.buffer = nextBuffer;
    this.start = 0;
  }

  get(index) {
    return this.buffer[(this.start + index) % this.buffer.length];
  }
  push(data) {
    if (!data || data.length === 0) {
      return;
    }
    this.ensureCapacity(this.length + data.length);
    for (let index = 0; index < data.length; index += 1) {
      this.buffer[(this.start + this.length + index) % this.buffer.length] = data[index];
    }
    this.length += data.length;
  }

  drop(count) {
    if (count <= 0) {
      return;
    }
    if (count >= this.length) {
      this.start = 0;
      this.length = 0;
      return;
    }
    this.start = (this.start + count) % this.buffer.length;
    this.length -= count;
  }

  read(count) {
    const actualCount = Math.min(count, this.length);
    const chunk = new this.TypedArrayClass(actualCount);
    for (let index = 0; index < actualCount; index += 1) {
      chunk[index] = this.get(index);
    }
    this.drop(actualCount);
    return chunk;
  }

  clear() {
    this.start = 0;
    this.length = 0;
  }
}

class MicrophoneCaptureProcessor extends AudioWorkletProcessor {
  targetSampleRate = 16000; // 16k
  inputSampleRate = 48000; // 48k
  emitDurationMs = 100; // 100ms
  emitSampleSize = 1600; // 10ms
  silenceThreshold = 0.005; // 静音检测阈值

  monoQueue = new TypedRingBuffer(Float32Array, 4096);
  pcmQueue = new TypedRingBuffer(Int16Array, 4096);
  resamplePosition = 0;
  chunkIndex = 0;
  emittedSamplesTotal = 0;

  constructor(options) {
    super();
    const processorOptions = options?.processorOptions || {};
    this.inputSampleRate = processorOptions.sampleRate || sampleRate || 48000;
    this.targetSampleRate = processorOptions.targetSampleRate || 16000;
    this.emitDurationMs = processorOptions.emitDurationMs || 100;
    this.emitSampleSize = Math.floor(this.targetSampleRate * (this.emitDurationMs / 1000));
    this.silenceThreshold = processorOptions.silenceThreshold || 0.002;
    this.port.onmessage = (event) => {
      const { data } = event;
      if (data?.type === "flush") {
        this.flushAll(true);
      }
    };
  }

  mixToMono(input) {
    if (!input || input.length === 0) {
      return null;
    }
    if (input.length === 1) {
      return input[0];
    }
    const mono = new Float32Array(input[0].length);
    for (let sampleIndex = 0; sampleIndex < mono.length; sampleIndex += 1) {
      let sum = 0;
      for (let channelIndex = 0; channelIndex < input.length; channelIndex += 1) {
        sum += input[channelIndex][sampleIndex] || 0;
      }
      mono[sampleIndex] = sum / input.length;
    }
    return mono;
  }

  downsampleQueuedMono(allowPartial = false) {
    if (this.monoQueue.length === 0) {
      return new Float32Array(0);
    }
    if (this.inputSampleRate === this.targetSampleRate) {
      const chunk = this.monoQueue.read(this.monoQueue.length);
      this.resamplePosition = 0;
      return chunk;
    }
    const step = this.inputSampleRate / this.targetSampleRate;
    const estimatedLength = Math.max(0, Math.floor((this.monoQueue.length - this.resamplePosition - 1) / step) + 1);
    const output = new Float32Array(Math.max(estimatedLength, 0));
    let outputIndex = 0;
    let position = this.resamplePosition;
    while (Math.floor(position) + 1 < this.monoQueue.length) {
      const leftIndex = Math.floor(position);
      const rightIndex = leftIndex + 1;
      const fraction = position - leftIndex;
      const leftSample = this.monoQueue.get(leftIndex);
      const rightSample = this.monoQueue.get(rightIndex);
      output[outputIndex] = leftSample + (rightSample - leftSample) * fraction;
      outputIndex += 1;
      position += step;
    }
    if (allowPartial && this.monoQueue.length > 0 && Math.floor(position) < this.monoQueue.length) {
      output[outputIndex] = this.monoQueue.get(this.monoQueue.length - 1);
      outputIndex += 1;
      position = this.monoQueue.length;
    }
    const consumed = Math.min(Math.floor(position), this.monoQueue.length);
    this.monoQueue.drop(consumed);
    this.resamplePosition = position - consumed;
    if (outputIndex === output.length) {
      return output;
    }
    return output.subarray(0, outputIndex);
  }

  encodePCM(samples) {
    const pcm = new Int16Array(samples.length);
    for (let index = 0; index < samples.length; index += 1) {
      const sample = Math.max(-1, Math.min(1, samples[index]));
      pcm[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }
    return pcm;
  }

  isSilentChunk(chunk) {
    if (!chunk || chunk.length === 0) {
      return true;
    }

    let energy = 0;
    for (let index = 0; index < chunk.length; index += 1) {
      const normalizedSample = chunk[index] / 0x8000;
      energy += normalizedSample * normalizedSample;
    }

    const rms = Math.sqrt(energy / chunk.length);
    return rms < this.silenceThreshold;
  }

  emitChunk(chunk, isLastChunk = false) {
    const chunkIndex = this.chunkIndex;
    this.chunkIndex += 1;
    this.emittedSamplesTotal += chunk.length;
    const isSilent = this.isSilentChunk(chunk);
    this.port.postMessage(
      {
        type: "pcm", // 事件类型
        pcm: chunk.buffer, // 当前这块 PCM 音频数据，对应一个 ArrayBuffer
        sampleRate: this.targetSampleRate, // 当前这块音频的采样率
        channels: 1, // 声道数，这里固定为单声道
        samples: chunk.length, // 当前这块音频包含的采样点数量
        durationMs: (chunk.length / this.targetSampleRate) * 1000, // 当前这块音频对应的时长，单位毫秒
        chunkIndex, // 当前是第几个音频块，从 0 开始递增
        emittedSamplesTotal: this.emittedSamplesTotal, // 从开始录音到现在，累计已经发出的采样点总数
        isLastChunk, // 是否为最后一块音频数据，通常在 flush 或结束时为 true
        isSilent, // 当前这块音频是否被判定为静音
      },
      [chunk.buffer],
    );
  }

  flushPCMChunks() {
    while (this.pcmQueue.length >= this.emitSampleSize) {
      const chunk = this.pcmQueue.read(this.emitSampleSize);
      this.emitChunk(chunk, false);
    }
  }

  flushAll(forceResidual = false) {
    const downsampled = this.downsampleQueuedMono(forceResidual);
    if (downsampled.length > 0) {
      this.pcmQueue.push(this.encodePCM(downsampled));
    }
    this.flushPCMChunks();
    if (forceResidual && this.pcmQueue.length > 0) {
      const chunk = this.pcmQueue.read(this.pcmQueue.length);
      this.emitChunk(chunk, true);
    }
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) {
      return true;
    }
    const mono = this.mixToMono(input);
    if (!mono || mono.length === 0) {
      return true;
    }
    this.monoQueue.push(mono);
    const downsampled = this.downsampleQueuedMono(false);
    if (downsampled.length > 0) {
      this.pcmQueue.push(this.encodePCM(downsampled));
      this.flushPCMChunks();
    }
    return true;
  }
}

registerProcessor("pcm-processor", MicrophoneCaptureProcessor);
