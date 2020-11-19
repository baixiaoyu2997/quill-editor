// debugger
export const focus = () => {
  return quill.focus()
}
export const getLength = () => {
  alert(quill.getLength())
  return quill.getLength()
}
export const delText = () => {
  quill.deleteText(3, 3)
}
export const getText = () => {
  console.log(quill.getText())
  return quill.getText()
}
export const setContents = () => {
  quill.setContents([
    { insert: 'Hello ' },
    { insert: 'World!', attributes: { bold: true } }
  ])
}
export const setFontSize = () => {
  quill.format('size', 'huge')
}

export const setSelection = () => {
  quill.setSelection(Math.floor(Math.random() * 10))
}
