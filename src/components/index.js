import Quill from "quill";
const BlockEmbed = Quill.import("blots/block/embed");
const Embed = Quill.import("blots/embed");

// image组件
class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute("id", value.id);
    node.setAttribute("src", value.url);
    // node.setAttribute('href','javascript:void(0);')
    // const img=document.createElement('img')
    // img.src=value.url
    // node.appendChild(img)
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
ImageBlot.tagName = "img";

// 标签组件
class QuillHashtag extends Embed {
  static create(value) {
    let node = super.create(value);
    node.setAttribute("contenteditable", false);
    node.innerText = `#${value}#`;
    return node;
  }
  static value(node) {
    return node.innerText;
  }
}
QuillHashtag.blotName = "hashtag";
QuillHashtag.className = "quill-hashtag";
QuillHashtag.tagName = "span";

Quill.register(ImageBlot);
Quill.register(QuillHashtag);
