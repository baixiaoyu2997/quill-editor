import Quill from "quill";
import { getQueryVariable } from "./index";
import loadingSVG from "../assets/loading.svg";
import { titleEl, titleWrapEl } from "../components/title";
import { globals, setGlobal } from "../global";
import { formatSubmit, resetFormat } from "./index";
import "./test";
const loadingImgs = {};
const textLink = {};
const Delta = Quill.import("delta");

const quill = new Quill("#editor", {
  scrollingContainer: "scrolling-container",
  placeholder: "请输入正文",
});

const initQuillValue = quill.getContents();
// 提交
export const getContents = () => {
  const commitObj = formatSubmit(quill.getContents());
  let html = quill.root.innerHTML;
  const reg = /http(s)?:\/\/(.*?)\//;
  // 去除图片链接中的host
  Object.keys(loadingImgs)
    .filter((x) => loadingImgs[x].code === 1)
    .forEach((x) => {
      const imgHTML = loadingImgs[x].bolt.domNode.innerHTML;
      const newImgHTML = imgHTML.replace(reg, "/");
      html = html.replace(String(imgHTML), newImgHTML);
    });
  const contents = {
    title: globals.SHOW_TITLE ? titleEl.value : "",
    html,
    canSubmit: globals.CAN_SUBMIT,
    ...commitObj,
  };
  return contents;
};
export const getFocus = (bool = true) => {
  // 设置参数true，编辑器会先获取焦点
  return quill.getSelection(bool).index;
};
export const setImg = (id, code, src, event) => {
  // code 0：加载失败 1：加载成功 2:加载中
  if (code === 2) {
    const boltIndex = getFocus();
    const src = loadingSVG;

    addImg({ src, id, code, boltIndex });

    // 加载中就设置不能提交
    setGlobal("CAN_SUBMIT", false);
  } else if (code === 1) {
    quill.focus();
    // 如果已经删除了那么不进行之后的操作
    if (loadingImgs[id].code === 0) {
      setGlobal("CAN_SUBMIT", true);
      return;
    }
    const boltIndex = quill.getIndex(loadingImgs[id].bolt);
    deleteImg({ id, rLength: boltIndex });
    addImg({
      src,
      id,
      code,
      boltIndex,
    });
  } else {
    const newId = event ? event.target.id : id;
    const boltIndex = quill.getIndex(loadingImgs[newId].bolt);
    const rLength = boltIndex - 1;
    deleteImg({
      id: newId,
      rLength,
      dLength: boltIndex === 0 ? 1 : 2,
      event,
    });
  }
};
// 添加图片
const addImg = ({ id, src, boltIndex, code }) => {
  quill.updateContents(
    new Delta().retain(boltIndex).insert({ image: { src, id: id } })
  );

  loadingImgs[id] = {
    bolt: Quill.find(document.getElementById(id)),
    code,
  };
  const newBoltIndex = quill.getIndex(loadingImgs[id].bolt);
  quill.setSelection(newBoltIndex + 1);
  scrollToFocus();
};
// 删除图片
const deleteImg = ({ id, dLength = 1, rLength, event }) => {
  if (event) loadingImgs[id].code = 0;
  quill.updateContents(new Delta().retain(rLength).delete(dLength));
};
// 显示标题输入框
export const showTitle = (bool) => {
  setGlobal("SHOW_TITLE", bool);
  if (bool) {
    titleWrapEl.classList.remove("hide");
  } else {
    titleWrapEl.classList.add("hide");
  }
  canSubmit();
};
// 判断是否能提交
export const canSubmit = () => {
  let flag = false;

  // 如果有图片在加载中，始终不能提交
  if (Object.values(loadingImgs).some((x) => x.load === 1)) {
    return flag;
  }
  const hasContentChange =
    quill.getContents().diff(initQuillValue).ops.length !== 0;
  if (!globals.SHOW_TITLE) {
    flag = hasContentChange;
  } else if (titleEl.value !== "" && hasContentChange) {
    flag = true;
  }
  if (globals.CAN_SUBMIT !== flag) {
    // CAN_SUBMIT懒修改
    setGlobal("CAN_SUBMIT", flag);
  }
  return flag;
};
export const onTextChange = (delta, oldDelta, source) => {
  const newDelta = quill.getContents();
  // 手动删除时去除loadingImgs内数据
  newDelta.diff(oldDelta).forEach((x) => {
    if (x.insert && x.insert.image) {
      loadingImgs[x.insert.image.id].code = 0;
    }
    // 手动删除时去除textLink对象内数据
    if (x.insert && x.insert.textLink) {
      delete textLink[x.insert.textLink.type];
    }
  });
  // 编辑器值改变时判断是否能提交
  canSubmit();
};
export const setTextLink = (id, text, type) => {
  let index = getFocus();
  // 超话和比特币只能各有一个
  if (textLink[type]) {
    const prevBlotIndex = quill.getIndex(textLink[type]);
    quill.updateContents(new Delta().retain(prevBlotIndex).delete(1));
    index = index + (prevBlotIndex < index ? -1 : 0);
  }
  quill.insertEmbed(index, "textLink", { id, text, type });
  textLink[type] = quill.getLeaf(index + 1)[0];
  quill.insertText(index + 1, " ", Quill.sources.SILENT); // 修复safari浏览器光标错位的问题，https://github.com/quilljs/quill/issues/1181#issuecomment-292513275
  quill.setSelection(index + 1);
};
// 滚动视图到指定位置
export const scrollToFocus = (index = getFocus()) => {
  window.scrollTo({
    top: quill.getBounds(index).top,
  });
};

quill.on("text-change", onTextChange);
