import { typeOf } from "./method.js";

// boolean string number object array

export function getStorage(key) {
  if (typeOf(key) != "string") return;
  let value = localStorage.getItem(key);
  if (!value) return value;
  const param = JSON.parse(value);
  if (["string"].includes(param.type)) {
    return param.val;
  }
  return JSON.parse(param.val);
}

export function setStorage(key, val) {
  if (typeOf(key) != "string") throw new Error("不受支持的存储类型");
  if (!["boolean", "string", "number", "object", "array"].includes(typeOf(val))) {
    throw new Error("不受支持的数据存储类型，请包含 boolean,string,number,object,array");
  }
  const param = {
    type: typeOf(val),
    val,
  };
  localStorage.setItem(key, JSON.stringify(param));
}

/**
 * 删除某个key对应的数据
 * @param {String} key 需要删除的key
 */
export function removeStorage(key) {
  localStorage.removeItem(key);
}

/**清空缓存*/
export function cleatStorage() {
  localStorage.clear();
}
