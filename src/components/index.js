import Icon from "./Icon/index.vue";
import Table from "./Table/index.vue";
import Upload from "./Upload/index.vue";
import Echarts from "./Echarts/index.vue";
import Editor from "./Editor/index.vue";

export default function (app) {
  app.component("myIcon", Icon);
  app.component("myTable", Table);
  app.component("myUpload", Upload);
  app.component("myEcharts", Echarts);
  app.component("myEditor", Editor);
}
