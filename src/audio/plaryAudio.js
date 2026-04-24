class FloatRingBuffer {
  constructor(initialCapacity = 8192) {
    this.buffer = new Float32Array(initialCapacity);
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

    const nextBuffer = new Float32Array(nextCapacity);
    for (let index = 0; index < this.length; index += 1) {
      nextBuffer[index] = this.get(index);
    }

    this.buffer = nextBuffer;
    this.start = 0;
  }

  get(index) {
    return this.buffer[(this.start + index) % this.buffer.length];
  }

  push(chunk) {
    if (!chunk || chunk.length === 0) {
      return;
    }

    this.ensureCapacity(this.length + chunk.length);

    for (let index = 0; index < chunk.length; index += 1) {
      this.buffer[(this.start + this.length + index) % this.buffer.length] = chunk[index];
    }

    this.length += chunk.length;
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
}

class PcmStreamPlayerProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const processorOptions = options?.processorOptions || {};

    this.sourceSampleRate = processorOptions.sourceSampleRate || 16000;
    this.prebufferMs = processorOptions.prebufferMs || 200;
    this.statsIntervalMs = processorOptions.statsIntervalMs || 100;
    this.maxBufferedMs =
      Number.isFinite(processorOptions.maxBufferedMs) && processorOptions.maxBufferedMs > 0 ? processorOptions.maxBufferedMs : null;
    this.prebufferSamples = Math.max(1, Math.floor(this.sourceSampleRate * (this.prebufferMs / 1000)));
    this.maxBufferedSamples = this.maxBufferedMs
      ? Math.max(this.prebufferSamples, Math.floor(this.sourceSampleRate * (this.maxBufferedMs / 1000)))
      : null;

    this.initialQueueCapacity = 16384;
    this.queue = new FloatRingBuffer(this.initialQueueCapacity);
    this.playbackPosition = 0;
    this.sourceStep = this.sourceSampleRate / sampleRate;
    this.receivedSamplesTotal = 0;
    this.playedSamplesTotal = 0;
    this.chunkCount = 0;
    this.isPaused = false;
    this.isPlaying = false;
    this.isBuffering = true;
    this.needsPrebuffer = true;
    this.framesUntilStats = this.statsFrameInterval();

    this.port.onmessage = (event) => {
      const { data } = event;

      if (data?.type === "addAudioChunk") {
        this.appendChunk(data.buffer);
        return;
      }

      if (data?.type === "pause") {
        this.pausePlayback();
        return;
      }

      if (data?.type === "resume") {
        this.resumePlayback();
        return;
      }

      if (data?.type === "stop") {
        this.stopPlayback();
        return;
      }

      if (data?.type === "append") {
        this.appendChunk(data.pcm);
        return;
      }

      if (data?.type === "reset") {
        this.stopPlayback();
      }
    };

    this.notify("ready");
    this.postStats();
  }

  statsFrameInterval() {
    return Math.max(128, Math.floor(sampleRate * (this.statsIntervalMs / 1000)));
  }

  notify(type, extra = {}) {
    this.port.postMessage({
      type,
      ...extra,
    });
  }

  getPlaybackSnapshot() {
    const currentTime = this.playedSamplesTotal / this.sourceSampleRate;
    const duration = this.receivedSamplesTotal / this.sourceSampleRate;
    const bufferedSamples = Math.max(0, this.queue.length);
    return {
      currentTime, // 当前已经播放出去的时长，单位秒
      duration, // 当前累计接收到的音频总时长，单位秒
      bufferedTime: bufferedSamples / this.sourceSampleRate, // 当前缓冲队列里还没播放的音频时长，单位秒
      receivedSamplesTotal: this.receivedSamplesTotal, // 累计接收到的 PCM 采样点总数
      playedSamplesTotal: this.playedSamplesTotal, // 累计已经播放掉的 PCM 采样点总数
      chunkCount: this.chunkCount, // 累计接收到的音频块数量
      isPlaying: this.isPlaying, // 当前是否处于播放中
      isPaused: this.isPaused, // 当前是否处于暂停状态
      isBuffering: this.isBuffering, // 当前是否处于缓冲等待更多数据的状态
      needsPrebuffer: this.needsPrebuffer, // 当前是否还需要先积累到预缓冲门槛后才能开始播放
      maxBufferedTime: this.maxBufferedSamples ? this.maxBufferedSamples / this.sourceSampleRate : null, // 允许缓存的最大音频时长，单位秒；null 表示不限制
    };
  }

  notifyInvalidChunk(reason, extra = {}) {
    this.notify("invalid-chunk", {
      reason,
      ...extra,
      ...this.getPlaybackSnapshot(),
    });
  }

  notifyOverflow(droppedSamples) {
    this.notify("overflow", {
      droppedSamples,
      droppedTime: droppedSamples / this.sourceSampleRate,
      maxBufferedSamples: this.maxBufferedSamples,
      ...this.getPlaybackSnapshot(),
    });
  }

  canStartPlayback() {
    if (this.isPaused) {
      return false;
    }

    if (this.queue.length === 0) {
      return false;
    }

    if (this.needsPrebuffer) {
      return this.queue.length >= this.prebufferSamples;
    }

    return true;
  }

  appendChunk(pcmBuffer) {
    if (!(pcmBuffer instanceof ArrayBuffer)) {
      this.notifyInvalidChunk("unsupported-buffer-type");
      return;
    }

    if (pcmBuffer.byteLength === 0) {
      return;
    }

    if (pcmBuffer.byteLength % 2 !== 0) {
      this.notifyInvalidChunk("unaligned-int16-chunk", { byteLength: pcmBuffer.byteLength });
      return;
    }

    let pcm;
    try {
      pcm = new Int16Array(pcmBuffer);
    } catch (error) {
      this.notifyInvalidChunk("int16-conversion-failed", {
        byteLength: pcmBuffer.byteLength,
        message: error?.message || String(error),
      });
      return;
    }

    let acceptedPcm = pcm;
    let droppedSamples = 0;

    if (this.maxBufferedSamples !== null) {
      const availableSamples = Math.max(0, this.maxBufferedSamples - this.queue.length);
      if (availableSamples === 0) {
        this.notifyOverflow(pcm.length);
        return;
      }

      acceptedPcm = pcm.length > availableSamples ? pcm.subarray(0, availableSamples) : pcm;
      droppedSamples = pcm.length - acceptedPcm.length;
      if (acceptedPcm.length === 0) {
        this.notifyOverflow(droppedSamples);
        return;
      }
    }

    const floatChunk = new Float32Array(acceptedPcm.length);
    for (let index = 0; index < acceptedPcm.length; index += 1) {
      const sample = acceptedPcm[index];
      floatChunk[index] = sample < 0 ? sample / 0x8000 : sample / 0x7fff;
    }

    this.queue.push(floatChunk);
    this.receivedSamplesTotal += floatChunk.length;
    this.chunkCount += 1;

    if (this.canStartPlayback()) {
      this.isPlaying = true;
      this.isBuffering = false;
      this.needsPrebuffer = false;
    } else if (!this.isPaused) {
      this.isBuffering = true;
    }

    if (droppedSamples > 0) {
      this.notifyOverflow(droppedSamples);
    }

    this.postStats();
  }

  pausePlayback() {
    this.isPaused = true;
    this.isPlaying = false;
    this.isBuffering = false;
    this.notify("paused", this.getPlaybackSnapshot());
    this.postStats();
  }

  resumePlayback() {
    this.isPaused = false;

    if (this.canStartPlayback()) {
      this.isPlaying = true;
      this.isBuffering = false;
      this.needsPrebuffer = false;
    } else {
      this.isPlaying = false;
      this.isBuffering = this.queue.length > 0;
    }

    this.notify("resumed", this.getPlaybackSnapshot());
    this.postStats();
  }

  resetPlaybackState() {
    this.queue = new FloatRingBuffer(this.initialQueueCapacity);
    this.playbackPosition = 0;
    this.receivedSamplesTotal = 0;
    this.playedSamplesTotal = 0;
    this.chunkCount = 0;
    this.isPaused = false;
    this.isPlaying = false;
    this.isBuffering = true;
    this.needsPrebuffer = true;
    this.framesUntilStats = this.statsFrameInterval();
  }

  stopPlayback() {
    this.resetPlaybackState();
    this.notify("stopped");
    this.postStats();
  }

  finishPlayback() {
    this.notify("ended", this.getPlaybackSnapshot());
    this.resetPlaybackState();
    this.postStats();
  }

  postStats() {
    if (!this.isPlaying) {
      return;
    }

    this.port.postMessage({
      type: "stats",
      ...this.getPlaybackSnapshot(),
    });
  }

  renderSample() {
    if (this.isPaused || !this.isPlaying) {
      return 0;
    }

    if (this.queue.length === 0) {
      this.finishPlayback();
      return 0;
    }

    const leftIndex = Math.floor(this.playbackPosition);
    if (leftIndex >= this.queue.length) {
      this.finishPlayback();
      return 0;
    }

    const rightIndex = Math.min(leftIndex + 1, this.queue.length - 1);
    const fraction = rightIndex === leftIndex ? 0 : this.playbackPosition - leftIndex;
    const leftSample = this.queue.get(leftIndex);
    const rightSample = this.queue.get(rightIndex);
    const outputSample = leftSample + (rightSample - leftSample) * fraction;

    this.playedSamplesTotal = Math.min(this.receivedSamplesTotal, this.playedSamplesTotal + this.sourceStep);
    this.playbackPosition += this.sourceStep;

    const consumed = Math.floor(this.playbackPosition);
    if (consumed > 0) {
      this.queue.drop(consumed);
      this.playbackPosition -= consumed;

      if (this.queue.length === 0) {
        this.finishPlayback();
      }
    }

    return outputSample;
  }

  process(inputs, outputs) {
    const outputChannels = outputs[0];
    if (!outputChannels || outputChannels.length === 0) {
      return true;
    }

    const frameCount = outputChannels[0].length;

    if (!this.isPaused && !this.isPlaying && this.canStartPlayback()) {
      this.isPlaying = true;
      this.isBuffering = false;
      this.needsPrebuffer = false;
    }

    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const sampleValue = this.renderSample();

      for (let channelIndex = 0; channelIndex < outputChannels.length; channelIndex += 1) {
        outputChannels[channelIndex][frameIndex] = sampleValue;
      }
    }

    this.framesUntilStats -= frameCount;
    if (this.framesUntilStats <= 0) {
      this.framesUntilStats = this.statsFrameInterval();
      this.postStats();
    }

    return true;
  }
}

registerProcessor("stream-player", PcmStreamPlayerProcessor);
