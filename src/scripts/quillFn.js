import Quill from "quill";
import { getQueryVariable } from "./utils";
import loadingImg from '../../public/loading.gif';
const Delta = Quill.import("delta");

const quill = new Quill("#editor", {
  scrollingContainer: "scrolling-container",
  placeholder: "请输入正文",
});

export const getContents = () => {
  // 处理image地址
  // const content = new Delta(
  //   quill.getContents().map((x) => {
  //     if (x.insert.image) {
  //       x.insert.image.url = x.insert.image.alt;
  //       return x;
  //     }
  //     return x;
  //   })
  // );
  console.log({ title: textareaEl.value, content: quill.getContents() });
  return { title: textareaEl.value, content: quill.getContents() };
};
export const getFocus = () => {
  return quill.getSelection().index;
};
export const setImg = (id, filepath, name, url) => {
  quill.focus(); // 防止插入图片时没有index
  const index = getFocus();

  quill.updateContents(
    new Delta()
      .retain(index)
      .insert({ image: { url: url || loadingImg, alt: id } })
  );
  quill.setSelection(index + 2);
  // imgObj[Date.now()]=quill.getLeaf(index+1)[0]

  window.scrollTo({
    top: quill.getBounds(index + 2).top,
  });
  // quill.getContents(index + 1, 1).ops[0].insert.image 获取上一次的图片地址

  // setTimeout(() => {
  //   quill.updateContents(
  //     new Delta()
  //       .retain(index + 1)
  //       .delete(1)
  //       .insert({ image: data.url || loadingImg })
  //   );
  // }, 2000);
};

// debugger
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
export const setSelection = () => {
  quill.setSelection(Math.floor(Math.random() * 10));
};
// export const getIndex=()=>{
//   Object.keys(imgObj).map(x=>{
//     console.log(quill.getIndex(imgObj[x]))
//   })
// }
