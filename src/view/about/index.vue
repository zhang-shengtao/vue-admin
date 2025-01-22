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
    <el-button @click="Excel">导出</el-button>
    <img width="100" v-preview height="100" :src="url" alt="测试图" />
    <!-- <el-input v-model="text" placeholder="输入框"></el-input> -->
  </el-card>
</template>

<script setup>
  import { login, upload, download } from "@/api";
  import { sliceFile, exportToExcel } from "@/utils/method";

  const text = ref("");
  const router = useRouter();
  const list = ref(["https://api.uomg.com/api/rand.avatar?sort=%E7%94%B7&a=1", "https://api.uomg.com/api/rand.avatar?sort=%E5%A5%B3&a=2"]);

  const url = ref("https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg");

  const isShow = ref(true);

  const header = ["ID", "姓名", "年龄", "性别", "体重(kg)", "户籍", "学历", "毕业院校", "毕业时间", "专业", "联系电话", "家庭住址", "备注"];
  const bodyData = [];

  // 循环往bodyData中添加随机假数据100万条
  for (let i = 0; i < 100000; i++) {
    bodyData.push([i + 1, "张一" + i, "18" + i, "男", "70" + i, "北京市", "本科", "北京大学", "2018年", "计算机科学", "13800000000" + i, "北京市东城区", "备注信息"]);
  }

  function Excel() {
    exportToExcel({ header, data: bodyData, fileName: "测试" });
  }

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
    sliceFile(e[0]).then((res) => {
      console.log(res);
    });

    // const data = new FormData();
    // data.append("type", "file");
    // data.append("file", e[0]);
    // upload(data, onUploadProgress)
    //   .then((res) => {
    //     console.log("res=>", res);
    //   })
    //   .catch((err) => {
    //     console.log("err=>", err);
    //   });
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
