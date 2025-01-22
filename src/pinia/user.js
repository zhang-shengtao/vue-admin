import { getMenu } from "@/api";
import _createRouter, { routes, moduleRoute } from "@/router";
const router = _createRouter();

const clearRouter = [];

// 格式化路径
function formatPath(val1, val2 = "") {
  if (val1.startsWith("http")) return val1;
  if (val1 && !val1.startsWith("/")) val1 = "/" + val1;
  if (val2 && !val2.startsWith("/")) val2 = "/" + val2;
  return val2 + val1;
}
// 处理要显示在菜单栏中的列表
function menuArr(allArr, path = "") {
  const arr = [];
  allArr.forEach((page) => {
    const item = { ...page };
    if (item.path != "/") item.path = formatPath(item.path, path);
    if (item.children && item.children.length && item.path != "/") {
      item.children = menuArr(item.children, item.path);
    }
    const isChildren = item.path === "/" && item.children && item.children.length;
    if (!item?.meta?.hidden) isChildren ? arr.push(...menuArr(item.children)) : arr.push(item);
  });
  return arr;
}
// 处理要搜索的菜单栏
function searchMenu(allArr, name = "") {
  let arr = [];
  allArr.forEach((item) => {
    if (item.meta && item.meta.title) {
      let value = name ? name + ">" + item.meta.title : item.meta.title;
      if (item.children && item.children.length) {
        arr = arr.concat(searchMenu(item.children, value));
      } else {
        arr.push({ path: item.path, value, target: !!item.meta.target });
      }
    }
  });
  return arr;
}
// 扁平化数组
function flatRoute(arr, path = "") {
  let flat = [];
  arr.forEach((page) => {
    const item = { ...page };
    if (item.children && item.children.length) {
      const obj = { ...item, url: formatPath(item.path, path) };
      obj.children && delete obj.children;
      flat.push(obj, ...flatRoute(item.children, item.path == "/" ? "" : item.path));
    } else {
      flat.push({ ...item, url: formatPath(item.path, path) });
    }
  });
  return flat;
}
// 需要处理的动态路由 routes(后端返回的路由) flat(前端的扁平化路由)
function concatRouter(routes = [], flat = []) {
  function findPage(path) {
    return flat.find((v) => [formatPath(v.url)].includes(formatPath(path)));
  }
  function handleRouer(routers) {
    const arr = [];
    routers.forEach((item) => {
      const page = findPage(item.path); // item.path后端返回的给前端的页面路由
      if (page) {
        page.meta = Object.assign(page.meta || {}, item.meta || {});
        if (item.children && item.children.length) {
          page.children = handleRouer(item.children);
          arr.push(page);
        } else {
          arr.push(page);
        }
      }
    });
    return arr;
  }
  return handleRouer(routes);
}

export default defineStore("user", () => {
  const data = reactive({
    userInfo: {},
    menuArr: [], // 所有的菜单页面
    searchMenu: [], // 要搜索的页面数组
  });
  // 处理路由
  function formatRouter(arr) {
    const menuAll = menuArr(arr || routes);
    data.menuArr = menuAll;
    data.searchMenu = searchMenu(menuAll);
  }
  // 这里是请求路由详细信息
  function getRouterInfo() {
    return new Promise((resolve, reject) => {
      getMenu()
        .then((res) => {
          data.userInfo.username = "ahahahafadfa"; // 如果没有用户信息的接口这里可以给个假的username
          const flat = flatRoute(moduleRoute);
          const route = concatRouter(res, flat);
          if (!route.some((v) => v.path === "/")) {
            const obj = flat.find((v) => [formatPath(v.path), formatPath(v.url)].includes("/"));
            router.addRoute(obj);
          }
          route.forEach((item) => {
            delete item.url;
            if (item.path.startsWith("http")) return;
            if (item.component.name === "layout") {
              const tag = router.addRoute(item);
              clearRouter.push(tag);
            } else {
              const tag = router.addRoute("root", item);
              clearRouter.push(tag);
            }
          });
          formatRouter(routes.concat(route));
          resolve();
        })
        .catch(reject);
    });
  }

  // 获取用户信息并处理左侧菜单栏
  function getUserInfo() {
    data.userInfo.username = "adf3232342342"; // 如果没有用户信息的接口这里可以给个假的username
    formatRouter(routes);
  }

  // 清除已经注册的路由记录
  function resetRouter() {
    clearRouter.forEach((v) => v());
    clearRouter.length = 0;
    data.userInfo = {};
  }
  return { ...toRefs(data), getRouterInfo, resetRouter, getUserInfo };
});
