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
 * @param n 最小值
 * @param m 最大值
 * @returns String
 */
export function random(n, m) {
  return Math.floor(Math.random() * (m - n) + n);
}

export function uploadFile(obj) {
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
      resolve(flieList);
      input.removeEventListener("change", files);
      input = null;
      flieList = null;
    }
  });
}

/**
 * 文件切片
 * @param { File | Array[File] } file   是否多选 { File | Array[File] }
 * @param {Number} point 断点续传的分片位置
 * @returns {Array} Array[Object]
 */
export function sliceFile(file, point = 0) {
  return new Promise((resolve) => {
    let fileList = [];
    const size = 1024 * 1024 * 10; // 每片大小10M
    const sliceFileTotal = Math.ceil(file.size / size); // 总共要切多少片
    let cupNum = navigator.hardwareConcurrency; // 需要开启得线程(cup核心数)
    if (sliceFileTotal < cupNum) cupNum = sliceFileTotal;
    let remainder = sliceFileTotal % cupNum; // 多出来得分片数量
    const fragmentation = (sliceFileTotal - remainder) / cupNum; // 每一个线程需要分几片
    let start = 0;
    let end = 0;
    const promiseAll = [];
    for (let index = 0; index < cupNum; index++) {
      const p = new Promise((res) => {
        const myWorker = new Worker(new URL("./sliceFile.js", import.meta.url), { type: "module" });
        end = start + fragmentation + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        myWorker.postMessage({
          file,
          size,
          start,
          end,
          sliceFileTotal,
        });
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
