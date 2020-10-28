import Quill from "quill";
import { getQueryVariable } from "./index";
import loadingSVG from "../assets/loading.svg";
import { titleEl, titleWrapEl } from "../components/title";
import { globals, setGlobal } from "../global";
import { formatSubmit, resetFormat } from "./index";
import readOnlyStyle from "!!raw-loader!../assets/css/readOnly.css";
const readOnlyCss = `<style>${readOnlyStyle}</style>`;

import "./test";

const loadingImgs = {};
const textLine = {};

const Delta = Quill.import("delta");

const quill = new Quill("#editor", {
  scrollingContainer: "scrolling-container",
  placeholder: "请输入正文",
});

const initQuillValue = quill.getContents();
// 提交
export const getContents = () => {
  const content = formatSubmit(quill.getContents());
  
  const contents = {
    title: titleEl.value,
    content,
    html: readOnlyCss + quill.root.innerHTML,
    canSubmit: globals.CAN_SUBMIT,
  };
  return contents;
};
// 获取光标位置,必须在编辑器有焦点的情况下才能执行
export const getFocus = () => {
  // console.log(quill.getSelection().index);
  return quill.getSelection().index;
};
export const setImg = (id, code, src, event) => {
  // code 0：加载失败 1：加载成功 2:加载中
  if (code === 2) {
    quill.focus(); // 防止插入图片时没有index
    const boltIndex = getFocus();
    const selectIndex = boltIndex + 2;
    const src = loadingSVG;
    const newBolt = () => quill.getLeaf(boltIndex === 0 ? 0 : boltIndex + 1)[0];
    addImg({ src, id, newBolt, code: 2, boltIndex, selectIndex });

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
    console.log("=======加载中图片位置：" + boltIndex);
    const deleteOptions = {
      rLength: boltIndex,
      dLength: 1,
    };
    const newBolt = () => {
      return quill.getLeaf(getFocus() - 1)[0];
    };
    addImg({
      src,
      id,
      newBolt,
      code: 1,
      boltIndex,
      selectIndex: boltIndex + 1,
      deleteOptions,
    });
  } else {
    const newId = event ? event.target.id : id;
    const boltIndex = quill.getIndex(loadingImgs[newId].bolt);
    const rLength = boltIndex - 1;
    quill.updateContents(
      deleteImg({
        id: newId,
        rLength,
        dLength: boltIndex === 0 ? 1 : 2,
        event,
      })
    );
  }
};
// 添加图片
const addImg = ({
  id,
  src,
  boltIndex,
  newBolt,
  code,
  selectIndex,
  deleteOptions,
}) => {
  // 不要对if else中的内容进行简写
  if (deleteOptions) {
    quill.updateContents(
      deleteImg({ id, ...deleteOptions }).insert({ image: { src, id: id } })
    );
  } else {
    quill.updateContents(
      new Delta().retain(boltIndex).insert({ image: { src, id: id } })
    );
  }
  loadingImgs[id] = {
    bolt: newBolt(),
    code,
  };
  quill.setSelection(selectIndex);
  window.scrollTo({
    top: quill.getBounds(selectIndex).top,
  });
};
// 删除图片
const deleteImg = ({ id, dLength, rLength, event }) => {
  if (event) loadingImgs[id].code = 0;
  return new Delta().retain(rLength).delete(dLength);
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
  });
  // 编辑器值改变时判断是否能提交
  canSubmit();
};
export const setTextLine = (id, text, type) => {
  quill.focus();
  let index = getFocus();
  // 超话和比特币只能各有一个
  if (textLine[type]) {
    const prevBlotIndex = quill.getIndex(textLine[type]);
    quill.updateContents(new Delta().retain(prevBlotIndex).delete(1));
    index = index + (prevBlotIndex < index ? -1 : 0);
  }
  quill.insertEmbed(index, "textLine", { id, text, type });
  textLine[type] = quill.getLeaf(index + 1)[0];
  quill.insertText(index + 1, ' ', Quill.sources.SILENT) // 修复safari浏览器光标错位的问题，https://github.com/quilljs/quill/issues/1181#issuecomment-292513275
  quill.setSelection(index + 1);
};
quill.on("text-change", onTextChange);
