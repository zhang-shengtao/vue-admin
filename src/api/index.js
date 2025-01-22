import request from "@/utils/request";

export function login(data) {
  return request.get("/supplierapi/login/info", { params: data });
}

// 上传文件监听进度示例 onUploadProgress key名不可变
export function upload(data, fn) {
  return request.post("/api/v1/upload", data, { onUploadProgress: fn, isClear: false });
}
// export function upload(data, fn) {
//   return request({
//     url: "/api/v1/upload",
//     method: "post",
//     onUploadProgress: fn,
//     data,
//     isClear: false,
//   });
// }

// 下载文件监听进度示例 onDownloadProgress key名不可变
export function download(fn) {
  return request.get("/api/v1/download", { onDownloadProgress: fn, responseType: "blob", isClear: false });
}
// export function download(fn) {
//   return request({ url: "/api/v1/download", onDownloadProgress: fn, responseType: "blob", isClear: false });
// }

export function getMenu() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          path: "/home",
          name: "home",
        },
        {
          path: "/about",
          name: "about",
        },
        {
          path: "/test",
          name: "test",
          children: [
            {
              path: "/t",
              name: "t",
            },
            {
              path: "/test_home",
              name: "test_home",
            },
          ],
        },
      ]);
    }, 2000);
  });
}
