export { default as userPinia } from "./user";
import { createPinia } from "pinia";

let pinia;
export default function _createPinia() {
  if (pinia) return pinia;
  pinia = createPinia();
  return pinia;
}
