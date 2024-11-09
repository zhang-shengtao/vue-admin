<template>
  <el-card>
    <el-input v-model="text" placeholder="输入框"></el-input>
    <my-upload :upload="fileList" multiple v-model:fileList="list" :limit="4"> </my-upload>
    <!-- <my-upload accept=".png,.txt" dray :upload="fileLists" v-model:fileList="list">
      <div class="drag">这里是拖拽区域</div>
    </my-upload> -->
    <el-button @click="logins">login</el-button>
    <el-button v-file="chooseFile">upload</el-button>
    <el-button @click="downloadFile">download</el-button>
    <img width="100" v-preview height="100" :src="url" alt="测试图" />
    <!-- <el-input v-model="text" placeholder="输入框"></el-input> -->
  </el-card>
</template>

<script setup>
import { login, upload, download } from "@/src/api";
const text = ref("");
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

function onUploadProgress(e) {
  console.log(e);
}

function chooseFile(e) {
  const data = new FormData();
  data.append("type", "file");
  data.append("file", e[0]);

  upload(data, onUploadProgress)
    .then((res) => {
      console.log("res=>", res);
    })
    .catch((err) => {
      console.log("err=>", err);
    });
}
function downloadProgress(e) {
  console.log("下载进度", e);
}

function downloadFile() {
  download(downloadProgress)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function fileLists(e) {
  console.log(e);
}

function fileList(e) {
  console.log(e);
  // list.value.push(URL.createObjectURL(new Blob(e)));
}

async function logins() {
  login({ username: "1100", password: "123456" });
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
