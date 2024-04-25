// 正则校验

const REG = {
  chinese: /[\u4e00-\u9fa5]/gm, // 匹配汉字
  tel: /^(0|86|17951)?(1[3-9][0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, // 匹配手机号
  card: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, // 匹配身份证号
};

export const chinese = REG.chinese;

export const tel = REG.tel;

export const card = REG.card;

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
