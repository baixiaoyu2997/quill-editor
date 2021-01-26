import '../src/index'
import { setGlobal } from '../src/global'
setGlobal('THEME', 'dark')

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.className = 'dark-mode'
})
