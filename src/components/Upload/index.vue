<template>
  <template v-if="dray">
    <div v-file:[accept].dray="upload">
      <slot></slot>
    </div>
  </template>
  <div class="space" v-else>
    <TransitionGroup name="list">
      <div
        v-if="fileList.length"
        class="fileList"
        @mouseenter="isShowModel = item"
        @mouseleave="isShowModel = ''"
        v-for="(item, i) in fileList"
        :key="item"
      >
        <img :src="item" class="img" alt="" />
        <div v-if="isShowModel === item" class="fileListModel center">
          <el-space size="large">
            <Icon name="ZoomIn" @click="preview(item)" color="#fff" :size="20" />
            <a :href="item" download="下载.png">
              <Icon name="Download" color="#fff" :size="20" />
            </a>
            <Icon name="Delete" v-if="isDetele" @click="deleteFileList(item, i)" color="#fff" :size="20" />
            <Icon name="CopyDocument" @click="copyUrl(item)" color="#fff" :size="20" />
          </el-space>
        </div>
      </div>
    </TransitionGroup>
    <template v-if="$slots.default">
      <div v-file:[accept]="upload" v-if="limit > fileList.length">
        <slot></slot>
      </div>
    </template>
    <template v-else>
      <div class="upload center" v-file:[accept]="upload" v-if="limit > fileList.length">
        <Icon name="Plus" class="iconPlus" :size="30" />
      </div>
    </template>
  </div>
  <Perview :url="previewUrl" v-model="isPreview" />
</template>

<script setup>
import Perview from "./perview.vue";
const props = defineProps({
  accept: {
    type: String,
    default: "*",
  },
  dray: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 1,
  },
  fileList: {
    type: Array,
    default: [],
    required: true,
  },
  isDetele: {
    type: Boolean,
    default: true,
  },
  upload: {
    type: Function,
    required: true,
  },
});
const emit = defineEmits(["update:file-list"]);
const isShowModel = ref("");
const isPreview = ref(false);
const previewUrl = ref("");

const deleteFileList = (item, i) => {
  emit(
    "update:file-list",
    props.fileList.filter((url) => url != item)
  );
};

const preview = (url) => {
  previewUrl.value = url;
  isPreview.value = true;
};

const { copy } = useClipboard();
async function copyUrl(url) {
  copy(url);
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
  background-color: #fafafa;
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
