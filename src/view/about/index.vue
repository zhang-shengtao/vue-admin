<template>
  <el-card>
    <Upload :upload="fileList" v-model:fileList="list" :limit="4"> </Upload>
    <Upload accept=".png,.txt" dray :upload="fileLists" v-model:fileList="list">
      <div class="drag">这里是拖拽区域</div>
    </Upload>
    <el-button @click="logins">login</el-button>
    <el-button @click="push">push</el-button>
    <img width="200" v-preview height="200" :src="url" alt="测试图" />
  </el-card>
</template>

<script setup>
import { login } from "@/src/api";
defineOptions({ name: "about" });
const router = useRouter();
const list = ref([
  "https://api.uomg.com/api/rand.avatar?sort=%E7%94%B7&a=1",
  "https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&a=2",
]);

const url = ref("https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg");

const isShow = ref(true);

function push() {
  router.push({
    path: "/home",
    query: {
      id: 1,
      name: "hahhah",
    },
  });
}

function upload(e) {
  console.log("上传进度", e);
}
function download(e) {
  console.log("下载进度", e);
}

function fileLists(e) {
  console.log(e);
}

function fileList(e) {
  list.value.push(URL.createObjectURL(new Blob(e)));
}

async function logins() {
  login({ username: "1100", password: "123456" }, { upload, download })
    .then((res) => {
      console.log(res);
    })
    .catch((res) => {
      console.log(res);
    });
}
</script>

<style lang="scss" scoped>
.drag {
  width: 100%;
  height: 200px;
  border: 1px solid #b7bcc2;
  border-radius: 2px;
}
:deep(.drag-hover) .drag {
  border-color: #409eff;
}
</style>
