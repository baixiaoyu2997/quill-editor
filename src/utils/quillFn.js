import Quill from 'quill'
import loadingSVG from '../assets/loading.svg'
import { titleEl, titleWrapEl } from '../components/title'
import { globals, setGlobal, lang } from '../global'
import { formatSubmit } from './index'
import './test'
const loadingImgs = {}
const textLink = {}
const Delta = Quill.import('delta')

const quill = new Quill('#editor', {
  scrollingContainer: 'scrolling-container',
  placeholder: lang[globals.LANG].shortPlaceholder
})

const initQuillValue = quill.getContents()

export const initHtmlValue = html => {
  const delta = quill.clipboard.convert(html)
  quill.setContents(delta)
}

export const initTextLink = (topicId, coinId) => {
  if (topicId) textLink.topic = findBoltByDataId(topicId)
  if (coinId) textLink.coin = findBoltByDataId(coinId)
}

export const initImg = () => {
  document.querySelectorAll('.quill-img').forEach(x => {
    loadingImgs[x.dataset.id] = {
      code: 1,
      bolt: findBoltByDataId(x.dataset.id)
    }
  })
}

// 提交
export const getContents = (options = {}) => {
  const { splitHost = true } = options
  const commitObj = formatSubmit(quill.getContents())
  let html = quill.root.innerHTML
  // 对图片做处理
  const reg = /http(s)?:\/\/(.*?)\//
  Object.keys(loadingImgs).forEach(x => {
    const imgDOM = loadingImgs[x].bolt.domNode
    const isLoading = loadingImgs[x].code === 2
    // 删除加载中图片
    if (isLoading) {
      html = html.replace(String(imgDOM.outerHTML), '')
    } else if (loadingImgs[x].code === 1 && splitHost) {
      // 去除图片host
      const newImgHTML = imgDOM.innerHTML.replace(reg, '/')
      html = html.replace(String(imgDOM.innerHTML), newImgHTML)
    }
  })
  const contents = {
    title: globals.SHOW_TITLE ? titleEl.value : '',
    html,
    ...commitObj
  }
  return contents
}
export const setContents = str => {
  const { html, topicId, coinId, title } = JSON.parse(str)
  showTitle(Boolean(title))
  if (title) {
    titleEl.value = title
  }
  // 防止转换过程中产生新的行(cms不会出现这个问题)
  initHtmlValue(
    html
      .replace(/<p><br><\/p>/g, '<br>')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '<br>')
  )
  initTextLink(topicId, coinId)
  initImg()
}
// 草稿
export const getDraft = () => {
  const content = quill.getContents()
  // 与初始值不一样
  const hasContentChange = content.diff(initQuillValue).ops.length !== 0
  if (hasContentChange) {
    return getContents({ splitHost: false })
  }
}
export const getFocus = (bool = true) => {
  // 设置参数true，编辑器会先获取焦点
  return quill.getSelection(bool).index
}
export const setImg = (id, code, src, event) => {
  // code 0：加载失败 1：加载成功 2:加载中
  if (code === 2) {
    const boltIndex = getFocus()
    const src = loadingSVG

    addImg({ src, id, code, boltIndex })

    // 加载中就设置不能提交
    setGlobal('CAN_SUBMIT', false)
  } else if (code === 1) {
    quill.focus()
    // 如果已经删除了那么不进行之后的操作
    if (
      loadingImgs[id].code === 0 &&
      !(globals.SHOW_TITLE && titleEl.value.trim() === '')
    ) {
      setGlobal('CAN_SUBMIT', true)
      return
    }
    const boltIndex = quill.getIndex(loadingImgs[id].bolt)
    deleteImg({ id, rLength: boltIndex })
    addImg({
      src,
      id,
      code,
      boltIndex
    })
  } else {
    const newId = event ? event.target.dataset.id : id
    const boltIndex = quill.getIndex(loadingImgs[newId].bolt)
    const rLength = boltIndex - 1
    deleteImg({
      id: newId,
      rLength,
      dLength: boltIndex === 0 ? 1 : 2,
      event
    })
  }
}
// 添加图片
const addImg = ({ id, src, boltIndex, code }) => {
  quill.updateContents(
    new Delta().retain(boltIndex).insert({ image: { src, 'data-id': id } })
  )

  loadingImgs[id] = {
    bolt: findBoltByDataId(id),
    code
  }
  const newBoltIndex = quill.getIndex(loadingImgs[id].bolt)
  quill.setSelection(newBoltIndex + 1)
  scrollToFocus()
}
// 删除图片
const deleteImg = ({ id, dLength = 1, rLength, event }) => {
  if (event) loadingImgs[id].code = 0
  quill.updateContents(new Delta().retain(rLength).delete(dLength))
}
// 显示标题输入框
export const showTitle = bool => {
  setGlobal('SHOW_TITLE', bool)
  changeLanguage()

  if (bool) {
    titleWrapEl.classList.remove('hide')
  } else {
    titleWrapEl.classList.add('hide')
  }
  canSubmit()
}
// 判断是否能提交
export const canSubmit = () => {
  let flag = false

  // 如果有图片在加载中，始终不能提交
  if (Object.values(loadingImgs).some(x => x.code === 2)) {
    return flag
  }
  const content = quill.getContents()
  // 与初始值不一样
  const hasContentChange = content.diff(initQuillValue).ops.length !== 0
  // 有普通文本内容
  const hasContentText = content.ops.some(
    x => typeof x.insert === 'string' && x.insert.trim() !== ''
  )
  if (!globals.SHOW_TITLE) {
    flag = hasContentChange && hasContentText
  } else if (
    titleEl.value.trim() !== '' &&
    hasContentChange &&
    hasContentText
  ) {
    flag = true
  }
  setGlobal('CAN_SUBMIT', flag)
  return flag
}

export const onTextChange = (delta, oldDelta, source) => {
  const newDelta = quill.getContents()

  // 手动删除时去除loadingImgs内数据
  newDelta.diff(oldDelta).forEach(x => {
    if (
      x.insert &&
      x.insert.image &&
      loadingImgs[x.insert.image?.['data-id']].code !== 1
    ) {
      loadingImgs[x.insert.image['data-id']].code = 0
    }
    // 手动删除时去除textLink对象内数据
    if (x.insert && x.insert.textLink) {
      delete textLink[x.insert.textLink['data-type']]
    }
  })
  // 编辑器值改变时判断是否能提交
  canSubmit()
}
export const setTextLink = (id, text, type) => {
  let index = getFocus()
  // 超话和比特币只能各有一个
  if (textLink[type]) {
    const prevBlotIndex = quill.getIndex(textLink[type])
    quill.updateContents(new Delta().retain(prevBlotIndex).delete(1))
    index = index + (prevBlotIndex < index ? -1 : 0)
  }
  quill.insertEmbed(index, 'textLink', {
    'data-id': id,
    'data-text': text,
    'data-type': type
  })
  textLink[type] = quill.getLeaf(index + 1)[0]
  quill.insertText(index + 1, ' ', Quill.sources.SILENT) // 修复safari浏览器光标错位的问题，https://github.com/quilljs/quill/issues/1181#issuecomment-292513275
  quill.setSelection(index + 1)
}
// 滚动视图到指定位置
export const scrollToFocus = (index = getFocus()) => {
  window.scrollTo({
    top: quill.getBounds(index).top
  })
}
export const changeLanguage = () => {
  if (globals.SHOW_TITLE) {
    document
      .getElementById('title')
      .setAttribute('placeholder', lang[globals.LANG].titlePlaceholder)
    quill.root.dataset.placeholder = lang[globals.LANG].longPlaceholder
  } else {
    quill.root.dataset.placeholder = lang[globals.LANG].shortPlaceholder
  }
}

const findBoltByDataId = id =>
  Quill.find(document.querySelector(`[data-id="${id}"]`))

quill.on('text-change', onTextChange)

// 添加匹配器，支持在粘贴的时候过滤掉style属性,过滤掉外部图片
quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
  const ops = []
  delta.ops.forEach(op => {
    if (Array.from(node.classList).includes('quill-img') && op.insert?.image) {
      const src = node.querySelector('img').src
      ops.push({ insert: { image: { ...op.insert.image, src } } })
    } else if (!op?.insert?.image) {
      ops.push(op)
    }
  })
  delta.ops = ops
  return delta
})
