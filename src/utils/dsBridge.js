import { setImg, getContents, showTitle, setTextLine } from "./quillFn";
import { setGlobal } from "../global";
const dsBridge = require("dsbridge");
dsBridge.register("insertImage", setImg); // id, code, url
dsBridge.register("getContent", getContents);
dsBridge.register("showTitle", showTitle); // 显示隐藏title
dsBridge.register("insertTopic", (id, name) => setTextLine(id, name, "#")); // 插入超话
dsBridge.register("insertCoin", (id, name) => setTextLine(id, name, "$")); // 插入比特币
