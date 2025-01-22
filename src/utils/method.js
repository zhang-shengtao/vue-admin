import MySliceFile from "@/worker/sliceFile?worker";
import MyExportToExcel from "@/worker/exportToExcel?worker";
import PreView from "@/components/Upload/perview.vue";

/**
 * 判断类型
 * @param value 要判断的值
 * @returns String
 */
export function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase();
}

/**
 * n-m的随机整数
 * @param n 最小值(默认1)
 * @param m 最大值(默认100)
 * @returns number
 */
export function random(n = 1, m = 100) {
  return Math.floor(Math.random() * (m - n) + n);
}

/**
 * 生成一个随机字符串
 * @param length 长度
 * @returns String
 */
export function randomString(length = 12) {
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(36)).join("");
}

/**
 * 打开择文件选择框
 * @param {Object} obj 一个对象类型的参数
 * @param {Boolean} obj.multiple 是否多选
 * @param {String} obj.accept 需要选择的文件后缀名
 * */
export function chooseFile(obj) {
  const { multiple, accept } = Object.assign({ multiple: false, accept: "*" }, obj || {});
  return new Promise((resolve, reject) => {
    let input = document.createElement("input");
    let flieList = [];
    input.type = "file";
    if (multiple) input.multiple = "multiple";
    input.accept = accept;
    input.click();
    input.addEventListener("change", files);
    function files() {
      for (const f of input.files) {
        flieList.push(f);
      }
      input.removeEventListener("change", files);
      resolve(flieList);
      input = null;
      flieList = null;
    }
  });
}

/**
 * 预览图片
 * @param {String||Arrray} url 图片地址 支持数组
 */
export function proviewImage(url) {
  const fullscreenElement = document.fullscreenElement;
  const teleported = fullscreenElement && ["HTML", "BODY"].includes(fullscreenElement.nodeName);
  const app = createApp(PreView, {
    urlList: url,
    teleported: !fullscreenElement || teleported,
    onClose() {
      app.unmount();
    },
  });
  const div = document.createElement("div");
  app.mount(div);
  if (fullscreenElement) {
    fullscreenElement.append(div);
  } else {
    document.body.append(div);
  }
}

/**
 * 文件切片
 * @param { File | Array[File] } file 需要分片的文件 { File | Array[File] }
 * @returns {Array} Array[Object]
 */
export function sliceFile(file) {
  // 是否是文件对象
  if (!(file instanceof File)) return new Error("file is not instanceof File");
  return new Promise((resolve) => {
    let fileList = [];
    const size = 1024 * 1024 * 10; // 每片大小10M
    const sliceFileTotal = Math.ceil(file.size / size); // 总共要切多少片
    let cupNum = navigator.hardwareConcurrency || 6; // 需要开启的线程(cup核心数)
    if (sliceFileTotal < cupNum) cupNum = sliceFileTotal;
    let remainder = sliceFileTotal % cupNum; // 多出来得分片数量
    const fragmentation = (sliceFileTotal - remainder) / cupNum; // 每一个线程需要分几片
    let start = 0;
    let end = 0;
    const promiseAll = [];
    for (let index = 0; index < cupNum; index++) {
      const p = new Promise((res) => {
        const myWorker = new MySliceFile({ type: "module" });
        end = start + fragmentation + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        myWorker.postMessage({ file, size, start, end, sliceFileTotal });
        myWorker.onmessage = function (e) {
          res(e.data);
          myWorker.terminate();
        };
        start = end;
      });
      promiseAll.push(p);
    }
    Promise.all(promiseAll).then((res) => {
      res.forEach((arr) => {
        if (fileList.length) {
          const i = fileList[fileList.length - 1].fragmentationIndex;
          const index = arr[0].fragmentationIndex;
          if (i < index) {
            fileList = fileList.concat(arr);
          } else {
            fileList = arr.concat(fileList);
          }
        } else {
          fileList = fileList.concat(arr);
        }
      });
      resolve(fileList);
    });
  });
}

/**
 * 把对象转为formData
 */
export function objToFormData(obj) {
  const formData = new FormData();
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key]);
  });
  return formData;
}

/**
 * 下载文件流
 * @param {Blob} blob 要下载的文件流
 * @param {String} fileName 下载的文件名称(带后缀名)
 */
export function downloadFlie(blob, fileName) {
  let url = URL.createObjectURL(new Blob([blob]));
  let a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  a = null;
  URL.revokeObjectURL(url);
  url = null;
}

/**
 * 导出JSON数据为Excel表格
 * @param {Array} header 要导出的表头JSON数据
 * @param {Array[Array]} data 要导出的表体JSON数据
 * @param {String} fileName 导出的文件名称
 */
export function exportToExcel(option) {
  let { header, data, fileName, onProgress = (val) => {} } = Object.assign({ header: [], data: [], fileName: "", onProgress: (val) => {} }, option || {});
  return new Promise((resolve, reject) => {
    const myWorker = new MyExportToExcel({ type: "module" });
    myWorker.postMessage({ header, data });
    myWorker.onmessage = function (event) {
      const { error, progress, blob } = event.data;
      event.data.hasOwnProperty.call("progress") && onProgress(progress);
      if (error) return reject(error);
      if (!fileName.endsWith(".xls") || !fileName.endsWith(".xlsx")) fileName += ".xlsx";
      downloadFlie(blob, fileName);
      myWorker.terminate();
      resolve();
    };
  });
}
