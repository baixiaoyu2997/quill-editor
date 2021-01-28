import { setGlobal } from '../global'
import {
  setImg,
  getContents,
  setContents,
  showTitle,
  setTextLink,
  scrollToFocus,
  getDraft
} from './quillFn'
const dsBridge = require('dsbridge')

export const getAppConfig = (config, from = 'app') => {
  const newConfig = from === 'app' ? config : dsBridge.call('getAppConfig')
  const formatConfig = {}
  if (newConfig?.theme) formatConfig.THEME = newConfig.theme
  if (newConfig?.language) formatConfig.LANG = newConfig.language
  return setGlobal(formatConfig)
}
dsBridge.register('insertImage', setImg) // id, code, url
dsBridge.register('getContent', getContents)
dsBridge.register('setContent', setContents)
dsBridge.register('showTitle', showTitle) // 显示隐藏title，参数：boolean
dsBridge.register('insertTopic', (id, name) => setTextLink(id, name, 'topic')) // 插入超话
dsBridge.register('insertCoin', (id, name) => setTextLink(id, name, 'coin')) // 插入比特币
dsBridge.register('scrollToFocus', scrollToFocus)
dsBridge.register('getDraft', getDraft) // 无值时返回undefined
dsBridge.register('onAppConfigChange', config => getAppConfig(config, 'app'))
