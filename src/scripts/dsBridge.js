import { setImg, getContents } from "./quillFn";
const dsBridge = require("dsbridge");
dsBridge.register("insertImage", setImg); // id,filepath,name,url
dsBridge.register("getContent", getContents);
