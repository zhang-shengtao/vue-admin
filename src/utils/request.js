import axios from "axios";
import { config, storageKey } from "@/config";
import { getStorage } from "./storage";

const clearRequest = [];
function isClearRequest(config, add = true) {
  let url = `${config.url}&${config.method}`;
  function clearRequests(c) {
    clearRequest.forEach((item, i) => {
      if (item.url == url) {
        item.c();
        clearRequest.splice(i, 1);
      }
    });
    if (add && c) clearRequest.push({ c, url });
  }
  if (add) return new axios.CancelToken(clearRequests);
  if (!add) clearRequests();
}
export function clearRequests() {
  clearRequest.forEach((item, i) => item.c());
  clearRequest.length = 0;
}
// 统一处理错误的钩子函数
function errorHandle(code, data) {
  switch (code) {
    case 401:
      console.log("登录去");
    default:
      console.log("未知错误");
  }
  return Promise.reject(code);
}

/**
 * @param {Object} params {Object}axios需要用到的全部参数
 * @param {Object} option {Object}自定义的全部参数
 * @param {Boolean} option.isClear {Boolean}是否要在特定时机取消请求 默认true
 * @returns Promise
 */
function request(params, option) {
  const { isClear } = Object.assign(option || {}, { isClear: true });
  const install = axios.create({
    baseURL: config.baseUrl,
  });
  install.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer " + getStorage(storageKey.token);
    if (isClear) config.cancelToken = isClearRequest(config);
    return config;
  });
  install.interceptors.response.use(
    (response) => {
      isClearRequest(response.config, false);
      const res = response.data;
      if (res.code >= 200 && res.code < 300) return res;
      else return errorHandle(res.code, res);
    },
    (error) => errorHandle(error)
  );
  if (params.upload) params.onUploadProgress = params.upload;
  return install(params);
}

export default request;
