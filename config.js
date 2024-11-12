/**
 * 整个项目的布局信息
 * @param {String} theme normal(默认) dark（黑暗）
 * @param {Boolean} isTag 是否显示标签栏
 */
export const layoutInfo = {
  theme: "normal",
  isTag: true,
};

const key = "USER";

/**整个项目的配置信息
 * @param {Boolean} isAddRouter 是否需要动态路由（true=需要）（false=不需要）
 * @param {String} baseUrl 项目请求的根路径
 * @param {String} base 项目部署在服务端的访问目录名称
 */
export const config = {
  isAddRouter: false,
  base: "/vue-admin",
  baseUrl: "http://testeshop.shiankuaixian.com:8085",
  key,
};

/**整个项目存储的key*/
export const storageKey = {
  token: `${key}_TOKEN`,
  theme: `${key}_THEME`,
  isTag: `${key}_IS_TAG`,
  userInfo: `${key}_USER_INFO`,
};
