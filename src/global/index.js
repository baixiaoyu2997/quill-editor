export const globals = {
  SHOW_TITLE: false,
  CAN_SUBMIT: false,
  THEME: 'light'
}
export const setGlobal = (name, value) => {
  globals[name] = value
}
