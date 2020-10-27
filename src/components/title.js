import { canSubmit } from "../utils/quillFn.js";
export const titleEl = document.getElementById("title");
titleEl.addEventListener("input", function (e) {
  this.style.height = "1.1em";
  this.style.height = this.scrollHeight + "px";
  canSubmit();
});

export const titleWrapEl = document.getElementsByClassName("titleInput")[0];
