import Quill from "quill";
const Delta = Quill.import("delta");

export const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
};
// 用于后台进行区分的特殊格式
export const formatSubmit = (delta) => {
  return delta.map((x) => {
    const isText = typeof x.insert === "string";
    const objKey = Object.keys(x.insert)[0];
    const content = isText ? { text: x.insert } : x.insert[objKey];
    return { type: isText ? "text" : objKey, content };
  });
};
// 还原后台传输数据为Delta格式
export const resetFormat = (data) => {
  return new Delta(
    data.map((x) => {
      let insert = {};
      if (x.type === "text") {
        insert = x.content.text;
      } else {
        console.log(x.type);
        console.log(x.content);
        insert[x.type] = x.content;
      }
      return { insert };
    })
  );
};
