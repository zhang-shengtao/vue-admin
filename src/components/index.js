import Icon from "./Icon/index.vue";
import Table from "./Table/index.vue";
import Upload from "./Upload/index.vue";

export default function (app) {
  app.component("Icon", Icon);
  app.component("Table", Table);
  app.component("Upload", Upload);
}
