import Quill from "quill";
import { setImg } from "../utils/quillFn";
const BlockEmbed = Quill.import("blots/block/embed");
const Embed = Quill.import("blots/embed");

// image组件
class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute("contenteditable", false);
    node.setAttribute("id", value.id);
    node.setAttribute("tabindex", -1);
    node.addEventListener("click", (e) => {
      setImg(null, null, null, e);
    }); // 只有点击删除的时候触发
    const img = document.createElement("img");
    img.setAttribute("src", value.src);
    node.appendChild(img);
    return node;
  }

  static value(node) {
    return {
      id: node.getAttribute("id"),
      src: node.firstChild.getAttribute("src"),
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
    node.setAttribute("type", value.type);
    node.setAttribute("text", value.text);
    node.setAttribute("id", value.id);
    node.innerHTML = `${
      this[value.type].sign + value.text + this[value.type].sign
    }`;
    node.classList.add(value.type);
    return node;
  }
  static value(node) {
    return {
      id: node.getAttribute("id"),
      text: node.getAttribute("text"),
      type: node.getAttribute("type"),
    };
  }
}
TextLine.blotName = "textLine";
TextLine.className = "quill-textLine";
TextLine.tagName = "a";
TextLine.top = {
  sign: "#",
};
TextLine.coin = {
  sign: "$",
};

Quill.register(ImageBlot);
Quill.register(TextLine);
