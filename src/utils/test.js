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
