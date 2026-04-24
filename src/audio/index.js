const isUserMediaUnsupported = !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia;

let audioStream = null; // 音频流
let audioContext = null; // 音频上下文
let recorder = null; // 录音机
let audioSource = null; /// 音频源
let player = null; // 播放器
let playerInstall = null; // 播放器安装

// 获取用户媒体
async function getUserMediaAudio() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      .then(resolve)
      .catch((err) => {
        console.log("获取不到麦克风", err);
        setTimeout(() => getUserMediaAudio().then(resolve), 3000);
      });
  });
}
// 获取全局唯一音频上下文
function initAudioContext() {
  if (audioContext) return audioContext;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContextClass();
  return audioContext;
}

// 播放器
export async function initPlayer() {
  if (playerInstall) return playerInstall;
  initAudioContext();
  await audioContext.audioWorklet.addModule(new URL("./plaryAudio.js", import.meta.url));
  player = new AudioWorkletNode(audioContext, "stream-player", {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [1],
    processorOptions: {
      sourceSampleRate: 16000, // 输入音频流本身的采样率 默认值：16000
      prebufferMs: 500, // 开始播放前，要先积累多少毫秒的数据 默认值：200
      statsIntervalMs: 100, //播放中 stats 事件的发送间隔，单位毫秒 默认值：100
      //   maxBufferedMs: 60000 * 2, //允许在队列里最多缓存多少毫秒的未播放音频。默认值：null
    },
  });
  player.connect(audioContext.destination);
  player.port.onmessage = (event) => playerCallBack(event);
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
  playerInstall = {
    async addAudioChunk(buffer) {
      player.port.postMessage({ type: "addAudioChunk", buffer }, [buffer]);
    },
    pause() {
      player.port.postMessage({ type: "pause" });
    },
    resume() {
      player.port.postMessage({ type: "resume" });
    },
    stop() {
      player.port.postMessage({ type: "stop" });
    },
  };
  return playerInstall;
}
// 录音机
export async function initRecorder() {
  if (audioStream) return;
  audioStream = await getUserMediaAudio();
  recorderListener(audioStream);
  initAudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
  audioSource = audioContext.createMediaStreamSource(audioStream);
  await audioContext.audioWorklet.addModule(new URL("./recorder.js", import.meta.url));
  recorder = new AudioWorkletNode(audioContext, "pcm-processor", {
    numberOfInputs: 1,
    numberOfOutputs: 0,
    processorOptions: {
      targetSampleRate: 16000,
      sampleRate: audioContext.sampleRate,
    },
  });
  audioSource.connect(recorder);
  recorder.port.onmessage = (event) => recorderCallBack(event);
}
// 监听录音
function recorderListener(audioStream) {
  const [audioTrack] = audioStream.getAudioTracks();
  audioTrack.addEventListener("ended", () => {
    stopRecorder();
  });
}
// 停止录音
function stopRecorder() {
  if (audioSource) {
    audioSource.disconnect();
    audioSource = null;
  }
  if (recorder) {
    recorder.disconnect();
    recorder = null;
  }
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
  }
  initRecorder();
}
// 录音器回调
function recorderCallBack(event) {
  const type = event.data.type;
  if (type === "pcm") {
    const pcm = event.data.pcm;
    // console.log("pcm=>", event.data);
  }
}
// 播放器回调
function playerCallBack(event) {
  const { type } = event.data;
  switch (type) {
    case "ready":
      console.log("播放器已就绪");
      break;
    case "stats":
      console.log("播放进度", event.data);
      break;
    case "paused":
      console.log("已暂停", event.data);
      break;
    case "resumed":
      console.log("恢复播放", event.data);
      break;
    case "stopped":
      console.log("已手动停止", event.data);
      break;
    case "ended":
      console.log("自然播放完成", event.data);
      break;
    case "invalid-chunk":
      console.warn("收到非法音频块", event.data);
      break;
    case "overflow":
      console.warn("缓冲区溢出，部分音频被丢弃", event.data);
      break;
    default:
      console.log("未知事件", event.data);
  }
}
