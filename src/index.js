import 'normalize.css'
import 'quill/dist/quill.core.css'
import './assets/css/common.css'
import '../src/assets/css/theme-light.css'
import '../src/assets/css/readOnly-light.css'
import '../src/assets/css/theme-dark.css'
import '../src/assets/css/readOnly-dark.css'

import './components'
import * as quillFn from './utils/quillFn'
import './utils/dsBridge'

if (process.env.NODE_ENV === 'development') {
  require('./index.html')
  document.querySelector('.test').classList.remove('test')
}
if (process.env.TEST_ENV === 'dev') {
  document.querySelector('.test').classList.remove('test')
}
if (module.hot) {
  module.hot.accept()
}
window.quillFn = { ...quillFn }
