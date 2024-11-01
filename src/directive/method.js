import { typeOf, uploadFile } from "@/src/utils/method.js";
import PreView from "@/src/components/Upload/perview.vue";
import { fullscreenElement } from "@/src/utils/document.js";

// v-file:[`.xls,.doc,.xlsx`].multiple.dray.image.img="uploadFile"
export function file(el, binding) {
  if (!["function", "asyncfunction"].includes(typeOf(binding.value))) {
    return console.error(new Error("请绑定回调函数"));
  }
  const multiple = !!binding.modifiers.multiple;
  let accept = "*";
  let ext = [];
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
    el.onclick = () => {
      uploadFile({ multiple: true, accept }).then(binding.value);
    };
  } else {
    el.style.cursor = "pointer";
    el.onclick = () => {
      uploadFile({ multiple, accept }).then(binding.value);
    };
  }
}

// v-preview
export function preview(el, binding) {
  el.onload = () => {
    el.style.cursor = "pointer";
    const teleported = ["HTML", "BODY"].includes(fullscreenElement.value.nodeName);
    el.onclick = () => {
      const app = createApp(PreView, {
        urlList: el.src,
        teleported: !fullscreenElement.value || teleported,
        onClose() {
          app.unmount();
        },
      });
      if (!!fullscreenElement.value && !teleported) {
        const div = document.createElement("div");
        app.mount(div);
        fullscreenElement.value.append(div);
      } else {
        app.mount(el);
      }
    };
  };
}
