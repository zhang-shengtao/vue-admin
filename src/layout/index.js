import layout from "./index.vue";
export { default as Headers } from "./Headers/index.vue";
export { default as MainApp } from "./MainApp/index.vue";
export { default as Menus } from "./Menus/index.vue";
import { layoutInfo } from "@/config";

const layoutInfoData = reactive(Object.assign(layoutInfo));
const menuWidth = ref(200); // 64 菜单栏的展开宽度
const headerHeight = ref(90); //90 头部的默认高度
const isCollapse = ref(false); // 是否合上菜单栏
const { width: winWidth } = useWindowSize();
const isModel = ref(false);

watch(
  () => layoutInfoData.isTag,
  (val) => {
    if (val) headerHeight.value = 90;
    if (!val) headerHeight.value = 60;
  }
);

watch(isCollapse, (val) => {
  if (val) menuWidth.value = 64;
  if (!val) menuWidth.value = 200;
});

let isShowMenu = null;
watchEffect(() => {
  if (winWidth.value <= 750) {
    if (isCollapse.value) {
      isShowMenu = isCollapse.value;
      isCollapse.value = false;
    }
  }
  if (winWidth.value > 750) {
    isModel.value = false;
    if (isShowMenu) isCollapse.value = isShowMenu;
    isShowMenu = null;
  }
});

export function layoutData() {
  return { menuWidth, headerHeight, isCollapse, layoutInfoData, winWidth, isModel };
}

export default layout;
