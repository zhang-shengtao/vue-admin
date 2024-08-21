export function getStorage(key) {
  let value = localStorage.getItem(key);
  try {
    value = JSON.parse(value);
  } catch (error) {}
  return value;
}

export function setStorage(key, val) {
  try {
    val = JSON.parse(val);
  } catch (error) {}
  localStorage.setItem(key, val);
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
