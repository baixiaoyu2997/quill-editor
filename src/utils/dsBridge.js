import { setImg, getContents, showTitle } from "./quillFn";
import { setGlobal } from "../global";
const dsBridge = require("dsbridge");
dsBridge.register("insertImage", setImg); // id, code, url
dsBridge.register("getContent", getContents);
dsBridge.register("showTitle", showTitle); // 显示隐藏title

const methods = {
  uploadImgFailed: () => {
    dsBridge.call("uploadImgFailed");
  },
  canSubmit: (bool) => {
    setGlobal("CAN_SUBMIT", bool);
    dsBridge.call("canSubmit", bool);
  },
};

export default methods;
