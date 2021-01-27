import { switchTheme } from '../utils'
import { changeLanguage } from '../utils/quillFn'
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
export const setGlobal = (key, value) => {
  if (!key) return
  let newKey = key
  if (typeof newKey === 'string') {
    newKey = {
      [newKey]: value
    }
  }
  Object.keys(newKey).forEach(key => {
    if (newKey[key] === undefined) return
    if (key === 'CAN_SUBMIT' && newKey[key] !== globals.CAN_SUBMIT) {
      dsBridge.call('canSubmit', newKey[key] ? '1' : '0')
    }
    if (key === 'THEME') {
      switchTheme(newKey[key])
    }
    if (Object.prototype.hasOwnProperty.call(globals, key)) {
      globals[key] = newKey[key]
    }
    if (key === 'LANG') {
      changeLanguage()
    }
  })
}
