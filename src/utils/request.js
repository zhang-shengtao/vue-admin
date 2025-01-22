import axios from "axios";
import { storageKey } from "#/config";
import { getStorage, removeStorage } from "./storage";

const baseURL = location.origin;
let isLogin = false; // 这里记录一个登录状态的变量当未登录的情况下有请求进来时候可以做一些事情
const clearRequest = [];
function isClearRequest(config, add = true) {
  let url = `${config.url}&${config.method}`;
  function clearRequests(cancel) {
    const i = clearRequest.findIndex((item) => item.url == url);
    if (i != -1) {
      clearRequest[i].cancel();
      clearRequest.splice(i, 1);
    }
    if (add && cancel) clearRequest.push({ cancel, url });
  }
  if (add) return new axios.CancelToken(clearRequests);
  clearRequests();
}
export function clearRequests() {
  clearRequest.forEach((item) => item.cancel());
  clearRequest.length = 0;
}

// 统一处理错误的钩子函数
function errorHandle(code, data) {
  switch (code) {
    case 401:
      removeStorage(storageKey.token);
      console.log("登录去");
    case 500:
      console.log("服务器错误");
    default:
      console.log("未知错误", data);
  }
  return Promise.reject(data);
}

const install = axios.create({
  baseURL,
  timeout: 5000,
});

install.interceptors.request.use((config) => {
  if (getStorage(storageKey.token)) {
    config.headers.Authorization = "Bearer " + getStorage(storageKey.token);
  }
  let isClear = true;
  if (config.hasOwnProperty("isClear")) isClear = config.isClear;
  if (isClear) config.cancelToken = isClearRequest(config);
  delete config.isClear;
  return config;
});

install.interceptors.response.use(
  (response) => {
    isClearRequest(response.config, false);
    const res = response.data;
    if (res instanceof Blob) return res;
    if (res.status >= 200 && res.status < 300) return res;
    return errorHandle(res.status, res);
  },
  (error) => errorHandle(error.response.status, error.response.data),
);

export default install;
