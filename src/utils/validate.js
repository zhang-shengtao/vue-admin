// 正则校验
const REG = {
  chinese: /[\u4e00-\u9fa5]/gm, // 匹配汉字
  tel: /^1[3-9]\d{9}$/, // 匹配11位手机号
  card: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][0-9])|(3[0-1]))\d{3}([0-9]|X)$/, // 匹配身份证号
  pwd: "/^(?=.*d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[@_.,?#$%&!*]+)[da-zA-Z@_.,?#$%&!*]{6,12}$/", // 匹配大小写、数字、特殊字符@_.,?#$%&!*
};

export const chinese = REG.chinese;
export const tel = REG.tel;
export const card = REG.card;
export const pwd = REG.pwd;

/**
 * 正则校验
 * @param {String} key 需要使用的正则规则
 * @param {String} value 需要校验的值
 * @returns {Boolean}  Boolean
 * */
function validate(key, value) {
  return REG[key].test(value);
}

export default validate;
