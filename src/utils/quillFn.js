import Quill from "quill";
import { getQueryVariable } from "./index";
import loadingImg from "../assets/loading.svg";
import { titleEl, titleWrapEl } from "../components/title";
import { globals, setGlobal } from "../global";
import dsBridge from "./dsBridge";
const Delta = Quill.import("delta");
const loadingImgs = {};
const quill = new Quill("#editor", {
  scrollingContainer: "scrolling-container",
  placeholder: "请输入正文",
});

const initQuillValue = quill.getContents();

export const getContents = () => {
  // 处理image地址
  // const content = new Delta(
  //   quill.getContents().map((x) => {
  //     if (x.insert.image) {
  //       x.insert.image.url = x.insert.image.id;
  //       return x;
  //     }
  //     return x;
  //   })
  // );
  // const wrap=document.getElementById('scrolling-container')
  const contents = {
    title: titleEl.value,
    content: quill.getContents(),
    html: document.getElementsByTagName("html")[0].outerHTML,
  };
  console.log(contents);
  return contents;
};
export const getFocus = () => {
  return quill.getSelection().index;
};
export const setImg = (id, code, url, event) => {
  // code 0：加载失败 1：加载成功 2:加载中
  if (code === 2) {
    quill.focus(); // 防止插入图片时没有index

    const index = getFocus();

    quill.updateContents(
      new Delta().retain(index).insert({ image: { url: loadingImg, id: id } })
    );

    loadingImgs[id] = {
      blot: quill.getLeaf(index === 0 ? 0 : index + 1)[0],
      load: false,
    };
    quill.setSelection(index + 2);
    window.scrollTo({
      top: quill.getBounds(index + 2).top,
    });
    // 加载中就设置不能提交
    dsBridge.canSubmit(false);
  } else if (code === 1) {
    const index = quill.getIndex(loadingImgs[id].blot);
    quill.focus();

    quill.updateContents(
      new Delta()
        .retain(index)
        .delete(1)
        .insert({ image: { url, id: id } })
    );
    loadingImgs[id].blot = quill.getLeaf(getFocus() - 1)[0];
    loadingImgs[id].load = true;

    quill.setSelection(index + 1);
    window.scrollTo({
      top: quill.getBounds(index + 3).top,
    });
  } else {
    const id = event ? event.target.id : id;
    const index = quill.getIndex(loadingImgs[id].blot);
    quill.updateContents(
      new Delta().retain(index - 1).delete(index === 0 ? 1 : 2)
    );
    loadingImgs[id].load = event ? true : false;

    if (code === 0) {
      dsBridge.uploadImgFailed();
    }
  }
};
export const showTitle = (bool) => {
  setGlobal("SHOW_TITLE", bool);
  if (bool) {
    titleWrapEl.classList.remove("hide");
  } else {
    titleWrapEl.classList.add("hide");
  }
};
export const canSubmit = () => {
  let flag = false;
  const isContentChange =
    quill.getContents().diff(initQuillValue).ops.length !== 0;
  if (!globals.SHOW_TITLE) {
    flag = isContentChange;
  } else if (titleEl.value !== "" && isContentChange) {
    flag = true;
  }
  if (globals.CAN_SUBMIT !== flag) {
    dsBridge.canSubmit(flag);
  }
  return flag;
};

// debugger
export const test = () => {
  alert(1);
};
export const setText = () => {
  quill.focus();
  const index = getFocus();
  quill.insertEmbed(index, "hashtag", "超话重在参与");
  quill.setSelection(index + 1);
};

export const getLines = () => {
  console.log(quill.getLines(getFocus()));
  return quill.getLines(getFocus());
};
export const getLength = () => {
  alert(quill.getLength());
  return quill.getLength();
};
export const delText = () => {
  quill.deleteText(3, 3);
};
export const getText = () => {
  console.log(quill.getText());
  return quill.getText();
};
export const setContents = () => {
  quill.setContents([
    { insert: "Hello " },
    { insert: "World!", attributes: { bold: true } },
  ]);
};
export const setFontSize = () => {
  quill.format("size", "huge");
};
export const onSelectChange = (range, oldDelta, source) => {
  if (source == "api") {
    console.log("===============API");
  } else if (source == "user") {
    console.log("===============User");
  }
};
export const onTextChange = (delta, oldDelta, source) => {
  const newDelta = quill.getContents();
  // 手动删除时去除loadingImgs内数据
  newDelta.diff(oldDelta).forEach((x) => {
    if (x.insert && x.insert.image) {
      loadingImgs[x.insert.image.id].load = true;
    }
  });
  canSubmit();
};
export const setSelection = () => {
  quill.setSelection(Math.floor(Math.random() * 10));
};
// export const getIndex=()=>{
//   Object.keys(loadingimgs).map(x=>{
//     console.log(quill.getIndex(loadingimgs[x]))
//   })
// }

quill.on("text-change", onTextChange);
