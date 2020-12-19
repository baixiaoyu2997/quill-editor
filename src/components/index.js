import Quill from 'quill'
import { setImg } from '../utils/quillFn'
const BlockEmbed = Quill.import('blots/block/embed')
const Embed = Quill.import('blots/embed')

// image组件
class ImageBlot extends BlockEmbed {
  static create (value) {
    const node = super.create()
    node.setAttribute('contenteditable', false)
    node.setAttribute('data-id', value?.['data-id'])
    node.setAttribute('tabindex', -1)
    node.addEventListener('click', e => {
      setImg(null, null, null, e)
    }) // 只有点击删除的时候触发
    const img = document.createElement('img')
    img.setAttribute('src', value?.src)
    node.appendChild(img)
    return node
  }

  static value (node) {
    return {
      'data-id': node.getAttribute('data-id'),
      src: node.firstChild.getAttribute('src')
    }
  }
}
ImageBlot.blotName = 'image'
ImageBlot.className = 'quill-img'
ImageBlot.tagName = 'div'

// 标签组件
class TextLink extends Embed {
  static create (value) {
    const node = super.create(value)
    node.setAttribute('contenteditable', false)
    node.setAttribute('data-type', value?.['data-type'])
    node.setAttribute('data-text', value?.['data-text'])
    node.setAttribute('data-id', value?.['data-id'])
    node.setAttribute(
      'href',
      `${this[value?.['data-type']]?.href + value?.['data-id']}`
    )
    // 编辑时，禁止a标签跳转
    node.addEventListener(
      'click',
      function (e) {
        e.preventDefault()
      },
      false
    )

    node.innerHTML = `${this[value?.['data-type']].sign +
      value?.['data-text'] +
      this[value?.['data-type']]?.sign}`
    node.classList.add(value?.['data-type'])
    return node
  }

  static value (node) {
    return {
      'data-id': node.getAttribute('data-id'),
      'data-text': node.getAttribute('data-text'),
      'data-type': node.getAttribute('data-type')
    }
  }
}
TextLink.blotName = 'textLink'
TextLink.className = 'quill-textLink'
TextLink.tagName = 'a'
TextLink.topic = {
  sign: '#',
  href: 'https://niuyan.com/topic/'
}
TextLink.coin = {
  sign: '$',
  href: 'https://niuyan.com/currencies/'
}

Quill.register(ImageBlot)
Quill.register(TextLink)
