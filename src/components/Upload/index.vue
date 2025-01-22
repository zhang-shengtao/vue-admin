<template>
  <div class="space">
    <TransitionGroup name="list">
      <div v-if="images.length" class="fileList" @mouseenter="isShowModel = item" @mouseleave="isShowModel = ''" v-for="(item, i) in images" :key="item">
        <img :src="item" class="img" alt="" />
        <div v-if="isShowModel === item" class="fileListModel center">
          <el-space size="large">
            <my-icon name="ZoomIn" @click="preview(item)" color="#fff" :size="20" />
            <a :href="item" download="下载.png">
              <my-icon name="Download" color="#fff" :size="20" />
            </a>
            <my-icon name="Delete" v-if="isDetele" @click="deleteFileList(item, i)" color="#fff" :size="20" />
            <my-icon name="CopyDocument" @click="copyUrl(item)" color="#fff" :size="20" />
          </el-space>
        </div>
      </div>
    </TransitionGroup>
    <div class="upload center" v-file:[accept]="upload" v-if="limit > images.length">
      <my-icon name="Plus" class="iconPlus" :size="30" />
    </div>
    <perview :url-list="previewUrl" :teleported="false" v-if="isPreview" @close="isPreview = false" />
  </div>
</template>

<script setup>
  import perview from "./perview.vue";
  const props = defineProps({
    // 文件类型
    accept: {
      type: String,
      default: "image/*",
    },
    // 限制上传数量
    limit: {
      type: Number,
      default: 1,
    },
    // 文件列表
    fileList: {
      type: Array || String,
      default: [],
      required: true,
    },
    // 是否显示删除按钮
    isDetele: {
      type: Boolean,
      default: true,
    },
    // 文件上传函数
    // 上传文件返回一个promise，返回结果为文件地址
    upload: {
      type: Function,
      required: true,
    },
  });
  const images = computed(() => {
    if (typeof props.fileList === "string") return [props.fileList];
    return props.fileList;
  });

  const emit = defineEmits(["update:file-list"]);
  const isShowModel = ref("");
  const isPreview = ref(false);
  const previewUrl = ref("");

  const deleteFileList = (item, i) => {
    emit(
      "update:file-list",
      props.fileList.filter((url) => url != item),
    );
  };

  const preview = (url) => {
    previewUrl.value = url;
    isPreview.value = true;
  };

  const { copy } = useClipboard();
  async function copyUrl(url) {
    await copy(url);
    ElMessage.success("复制成功");
  }
</script>

<style lang="scss" scoped>
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .list-leave-from,
  .list-leave-active {
    transform: translateY(-30px);
    transition: all 0.5s ease-out;
  }
  .list-leave-to {
    opacity: 0;
  }

  .list-enter-from,
  .list-enter-active {
    opacity: 0;
    transition: all 0.5s ease-out;
  }
  .list-enter-to {
    opacity: 1;
  }

  .space {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    vertical-align: top;
  }

  .upload {
    width: 150px;
    height: 150px;
    border: 1px dashed gray;
    // background-color: #fafafa;
    border-radius: 5px;
    text-align: center;
    .iconPlus {
      color: gray;
    }
  }

  .upload:hover {
    border: 1px dashed #409eff;
    .iconPlus {
      color: #409eff;
    }
  }
  .fileList {
    width: 150px;
    height: 150px;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    .img {
      width: 100%;
      height: 100%;
    }
    .fileListModel {
      user-select: none;
      cursor: default;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: #3333332f;
      z-index: 0;
    }
  }
</style>
