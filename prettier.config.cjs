/** 配置项文档：https://prettier.io/docs/en/configuration.html */

module.exports = {
  printWidth: 200, // 一行最多120
  tabWidth: 2, // 缩进2格
  bracketSpacing: true, // 大括号内的首尾需要空格
  arrowParens: "always", // 箭头函数，只有一个参数的时候，也需要括号
  endOfLine: "auto", // 换行符使用 auto
  singleQuote: false, // 是否使用单引号
  trailingComma: "all", // 末尾需要有逗号
  semi: true, // 末尾是否需要分号
  useTabs: false, // 不使用缩进符，而使用空格
  jsxSingleQuote: false, // jsx是否使用单引号
  proseWrap: "preserve", // 使用默认的折行标准
  vueIndentScriptAndStyle: true, // // style和script 标签内的内容是否缩进格式化
};
