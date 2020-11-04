import {
  setImg,
  getContents,
  showTitle,
  setTextLink,
  scrollToFocus,
} from "./quillFn";
import { setGlobal } from "../global";
const dsBridge = require("dsbridge");
dsBridge.register("insertImage", setImg); // id, code, url
dsBridge.register("getContent", getContents);
dsBridge.register("showTitle", showTitle); // 显示隐藏title，参数：boolean
dsBridge.register("insertTopic", (id, name) => setTextLink(id, name, "topic")); // 插入超话
dsBridge.register("insertCoin", (id, name) => setTextLink(id, name, "coin")); // 插入比特币
dsBridge.register("scrollToFocus", scrollToFocus);
