import { file, preview, resize } from "./method.js";
// 批量注册自定义指令
export default function (app, option) {
  app.directive("file", file);
  app.directive("preview", preview);
  app.directive("resize", resize);
}
