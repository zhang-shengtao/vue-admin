import { config } from "@/config";
import { getStorage } from "./storage";
import { storageKey } from "@/config";

const clearRrquest = [];

function request(obj = {}) {
  return new Promise((resolve, reject) => {
    const { url, method, data } = Object.assign({ url: "", method: "get", data: {} }, obj);
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const request = new Request(url, {
      method,
      headers: headers,
      body: JSON.stringify(data),
    });
    fetch(request)
      .then((res) => {
        const type = res.headers.get("Content-Type");
        console.log(type);
        return res.json();
      })
      .then((res) => {
        console.log(res);
      });
  });
}

export default request;
