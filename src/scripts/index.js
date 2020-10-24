import "normalize.css";
import "quill/dist/quill.core.css";
import "../styles/index.css";
import "./register";
import { titleInit } from "./title";
import * as quillFn from "./quillFn";
import "./dsBridge";

if (process.env.NODE_ENV === "development") {
  require("../index.html");
  document.querySelector(".test").classList.remove("test");
}

// 标题初始化
titleInit();
window.quillFn = { ...quillFn };
