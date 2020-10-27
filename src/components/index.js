import Quill from "quill";
import { setImg } from "../utils/quillFn";
const BlockEmbed = Quill.import("blots/block/embed");
const Embed = Quill.import("blots/embed");

// image组件
class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute("id", value.id);
    node.setAttribute("src", value.url);
    node.setAttribute("contenteditable", false);
    node.setAttribute("tabindex", -1);
    node.addEventListener("click", (e) => {
      setImg(null, null, null, e);
    }); // 只有点击删除的时候触发
    const img = document.createElement("img");
    img.src = value.url;
    node.appendChild(img);
    return node;
  }

  static value(node) {
    return {
      id: node.getAttribute("id"),
      url: node.getAttribute("src"),
    };
  }
}
ImageBlot.blotName = "image";
ImageBlot.className = "quill-img";
ImageBlot.tagName = "div";

// 标签组件
class TextLine extends Embed {
  static create(value) {
    let node = super.create(value);
    node.setAttribute("contenteditable", false);
    node.innerText = `${value.sign+value.name+value.sign}`;
    return node;
  }
  static value(node) {
    return node.innerText;
  }
}
TextLine.blotName = "textLine";
TextLine.className = "quill-textLine";
TextLine.tagName = "a";

Quill.register(ImageBlot);
Quill.register(TextLine);
