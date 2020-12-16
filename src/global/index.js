const dsBridge = require('dsbridge')

export const lang = {
  zh: {
    titlePlaceholder: '请输入标题',
    longPlaceholder: '请输入正文',
    shortPlaceholder: '向大家说说你的看法'
  },
  en: {
    titlePlaceholder: 'Please input title',
    longPlaceholder: 'please input content',
    shortPlaceholder: 'Tell everyone what you think'
  }
}
export const globals = {
  SHOW_TITLE: false,
  CAN_SUBMIT: false,
  THEME: 'light',
  LANG: 'zh'
}
export const setGlobal = (name, value) => {
  if (name === 'CAN_SUBMIT' && value !== globals.CAN_SUBMIT) {
    dsBridge.call('canSubmit', value)
  }
  globals[name] = value
}
