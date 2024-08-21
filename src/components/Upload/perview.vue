<template>
  <teleport to="body">
    <transition name="viewer-fade" appear>
      <div class="perview" v-if="model">
        <div class="perview_model"></div>
        <div class="perview_close center" @click="model = false">
          <Icon name="Close" color="#ffffff" :size="30" />
        </div>
        <div class="perview_image center">
          <img @mousedown="handleMouseDown" :style="imgStyle" :src="url" alt="预览图" />
        </div>
        <div class="perview_utils center">
          <Icon name="ZoomOut" color="#ffffff" @click="handleActions('ZoomOut')" :size="30" />
          <Icon name="ZoomIn" color="#ffffff" @click="handleActions('ZoomIn')" :size="30" />
          <Icon name="ScaleToOriginal" @click="handleActions('ScaleToOriginal')" color="#ffffff" :size="30" />
          <Icon name="RefreshLeft" @click="handleActions('RefreshLeft')" color="#ffffff" :size="30" />
          <Icon name="RefreshRight" @click="handleActions('RefreshRight')" color="#ffffff" :size="30" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  url: {
    type: String,
    default: "",
  },
});
const model = defineModel();

const transform = reactive({
  scale: 1,
  deg: 0,
  offsetX: 0,
  offsetY: 0,
  enableTransition: false,
});

const imgStyle = computed(() => {
  const { scale, deg, offsetX, offsetY, enableTransition } = transform;
  let translateX = offsetX / scale;
  let translateY = offsetY / scale;
  switch (deg % 360) {
    case 90:
    case -270:
      [translateX, translateY] = [translateY, -translateX];
      break;
    case 180:
    case -180:
      [translateX, translateY] = [-translateX, -translateY];
      break;
    case 270:
    case -90:
      [translateX, translateY] = [-translateY, translateX];
      break;
  }
  const style = {
    transform: `scale(${scale}) rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`,
    transition: enableTransition ? "transform .3s" : "",
  };
  style.maxWidth = style.maxHeight = "100%";
  return style;
});

function handleMouseDown(e) {
  const { offsetX, offsetY } = transform;
  transform.enableTransition = false;
  const startX = e.pageX;
  const startY = e.pageY;
  const dragHandler = (ev) => {
    transform.offsetX = offsetX + ev.pageX - startX;
    transform.offsetY = offsetY + ev.pageY - startY;
  };
  const removeMousemove = useEventListener(document, "mousemove", dragHandler);
  useEventListener(document, "mouseup", () => {
    removeMousemove();
  });
  e.preventDefault();
}

function handleActions(action) {
  switch (action) {
    case "ZoomOut":
      if (transform.scale > 0.2) {
        transform.scale = Number.parseFloat((transform.scale / 1.2).toFixed(3));
      }
      break;
    case "ZoomIn":
      if (transform.scale < 5) {
        transform.scale = Number.parseFloat((transform.scale * 1.2).toFixed(3));
      }
      break;
    case "RefreshLeft":
      transform.deg += 90;
      break;
    case "RefreshRight":
      transform.deg -= 90;
      break;
    case "ScaleToOriginal":
      reset();
      break;
  }
  transform.enableTransition = true;
}

function reset() {
  transform.scale = 1;
  transform.deg = 0;
  transform.offsetX = 0;
  transform.offsetY = 0;
  transform.enableTransition = false;
}

watch(model, (val) => {
  if (val === false) {
    reset();
  }
});
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.perview {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2005;
  .perview_model {
    background: #000;
    height: 100%;
    left: 0;
    opacity: 0.5;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .perview_close {
    background-color: #606266;
    border-color: #fff;
    color: #fff;
    font-size: 24px;
    height: 44px;
    width: 44px;
    right: 40px;
    top: 40px;
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    opacity: 0.8;
    position: absolute;
    user-select: none;
    z-index: 1;
  }
  .perview_image {
    position: static;
    user-select: none;
    width: 100%;
    height: 100%;
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
  .perview_utils {
    position: absolute;
    z-index: 1;
    opacity: 0.8;
    box-sizing: border-box;
    user-select: none;
    left: 50%;
    bottom: 30px;
    transform: translate(-50%);
    width: 282px;
    height: 44px;
    padding: 0 23px;
    border-color: #fff;
    border-radius: 22px;
    background-color: var(--el-text-color-regular);
    justify-content: space-around;
  }
}
</style>
