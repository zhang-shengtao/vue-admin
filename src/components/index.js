import Icon from "./Icon/index.vue";
import Table from "./Table/index.vue";
import Upload from "./Upload/index.vue";

export default function (app) {
  app.component("myIcon", Icon);
  app.component("myTable", Table);
  app.component("myUpload", Upload);
}
