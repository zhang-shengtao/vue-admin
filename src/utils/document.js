export const fullscreenElement = ref("");
useEventListener(document, "fullscreenchange", (e) => {
  if (document.fullscreenElement) {
    fullscreenElement.value = document.fullscreenElement;
  } else {
    fullscreenElement.value = "";
  }
});
