import request from "@/src/utils/request";

export function login(data, { upload, download }) {
  return request.post({
    url: "/company/v1/authorizations",
    data,
    upload,
    download,
  });
}

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
