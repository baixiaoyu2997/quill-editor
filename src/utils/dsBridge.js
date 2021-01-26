import {
  setImg,
  getContents,
  setContents,
  showTitle,
  setTextLink,
  scrollToFocus,
  setLang,
  getDraft
} from './quillFn'
import { switchTheme } from './index'
const dsBridge = require('dsbridge')
dsBridge.register('insertImage', setImg) // id, code, url
dsBridge.register('getContent', getContents)
dsBridge.register('setContent', setContents)
dsBridge.register('showTitle', showTitle) // 显示隐藏title，参数：boolean
dsBridge.register('insertTopic', (id, name) => setTextLink(id, name, 'topic')) // 插入超话
dsBridge.register('insertCoin', (id, name) => setTextLink(id, name, 'coin')) // 插入比特币
dsBridge.register('scrollToFocus', scrollToFocus)
dsBridge.register('setLang', setLang) // zh,en
dsBridge.register('switchTheme', switchTheme) // light,dark
dsBridge.register('getDraft', getDraft) // 无值时返回undefined
