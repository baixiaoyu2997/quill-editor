export const titleInit = () => {
  const textareaEl = document.getElementById("title");
  textareaEl.addEventListener("input", function (e) {
    this.style.height = "1.1em";
    this.style.height = this.scrollHeight + "px";
  });
};
