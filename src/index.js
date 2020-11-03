import "normalize.css";
import "quill/dist/quill.core.css";
import "./assets/css/index.css";
import "./assets/css/readOnly.css";
import "./components";
import * as quillFn from "./utils/quillFn";
import "./utils/dsBridge";
if (process.env.NODE_ENV === "development") {
  require("./index.html");
  document.querySelector(".test").classList.remove("test");
}
if (process.env.TEST_ENV === "dev") {
  document.querySelector(".test").classList.remove("test");
}
if (module.hot) {
  module.hot.accept();
}
window.quillFn = { ...quillFn };
