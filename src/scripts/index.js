import "../styles/index.css";
import Quill from "quill";
if (process.env.NODE_ENV === "development") {
  require("../index.html");
}
const quill = new Quill("#editor", {
  scrollingContainer: "scrolling-container",
  placeholder: "请输入正文",
});
