const dsBridge = require('dsbridge')

export const globals = {
  SHOW_TITLE: false,
  CAN_SUBMIT: false,
  THEME: 'light'
}
export const setGlobal = (name, value) => {
  if (name === 'CAN_SUBMIT' && value !== globals.CAN_SUBMIT) {
    dsBridge.call('canSubmit', value)
  }
  globals[name] = value
}
