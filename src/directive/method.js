import { typeOf, chooseFile, proviewImage } from "@/utils/method.js";

/*
 * v-file:[`.xls,.doc,.xlsx`].multiple.dray.image.img="chooseFile"
 *v-file:[`.xls,.doc,.xlsx`] = fn // 单选指定后缀的文件
 *v-file.multiple = fn // 多选图片
 *v-file.image.img="fn" // 单选图片
 *v-file.image.image="fn"// 单选图片
 *v-file.image.dray="fn" // 拖拽图片
 */
export function file(el, binding) {
  if (!["function", "asyncfunction"].includes(typeOf(binding.value))) {
    throw new Error("v-file:请绑定回调函数");
  }
  const multiple = !!binding.modifiers.multiple;
  let accept = "*";
  let ext = []; // 拖拽必须要通过后缀名过滤文件类型
  if (binding.modifiers.image || binding.modifiers.img || binding.arg === "image/*") {
    accept = ".xbm,.tif,.jfif,.ico,.tiff,.gif,.svg,.jpeg,.svgz,.jpg,.webp,.png,.bmp,.pjp,.apng,.pjpeg,.avif";
    ext = accept.split(",");
  } else {
    if (binding.arg && binding.arg != "*") {
      accept = binding.arg;
      ext = accept.split(",");
    }
  }
  if (binding.modifiers.dray) {
    const classNmae = "drag-hover";
    function entryList(arr) {
      const fileList = [];
      return new Promise((resolve) => {
        function pushFileList(file, fullPath, isResolve = false) {
          file.fullPath = fullPath;
          let exe = file.name.split(".");
          exe = exe[file.name.split(".").length - 1];
          if (ext.includes(`.${exe}`) || ext.length === 0) fileList.push(file);
          if (isResolve) resolve(fileList);
        }
        function deepEntryList(entry) {
          entry = entry.createReader();
          entry.readEntries((e) => deepFileList(Object.values(e)));
        }
        function isResolve(arr, i) {
          return i === arr.length - 1 && !arr.some((val) => val.isDirectory);
        }
        function deepFileList(arr) {
          arr.forEach((item, i) => {
            if (item.isFile) {
              item.file((file) => pushFileList(file, item.fullPath, isResolve(arr, i)));
            } else {
              deepEntryList(item, item.fullPath);
            }
          });
        }
        deepFileList(arr);
      });
    }
    el.ondrop = function (e) {
      e.preventDefault();
      e.stopPropagation();
      const items = Object.values(e.dataTransfer.items).map((item) => item.webkitGetAsEntry());
      entryList(items).then(binding.value);
      el.classList.remove(classNmae);
    };
    el.ondragover = function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "copy";
    };
    el.ondragenter = function (e) {
      e.preventDefault();
      e.stopPropagation();
      el.classList.add(classNmae);
    };
    el.ondragleave = function (e) {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove(classNmae);
    };
  }
  el.style.cursor = "pointer";
  el.onclick = () => {
    chooseFile({ multiple, accept }).then(binding.value);
  };
}

// v-preview="urlList"或者v-preview
export function preview(el, binding) {
  if (el.nodeName != "IMG") return console.error("请绑定img元素");
  el.onload = () => {
    el.style.cursor = "pointer";
    el.onclick = () => {
      proviewImage(binding.value || el.src);
    };
  };
}

// v-resize="fn"
export const resize = {
  mounted(el, binding) {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      requestAnimationFrame(() => {
        binding.value({ w: width, h: height });
      });
    });
    observer.observe(el);
    el._resizeObserver = observer;
  },
  unmounted(el) {
    if (el._resizeObserver) {
      el._resizeObserver.disconnect();
      delete el._resizeObserver;
    }
  },
};
