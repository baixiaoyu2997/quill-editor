import Quill from 'quill'
const Delta = Quill.import('delta')

// 用于后台进行区分的特殊格式
export const formatSubmit = delta => {
  const obj = {
    topicId: '',
    coinId: ''
  }
  obj.content = delta.map(x => {
    const isText = typeof x.insert === 'string'
    const objKey = Object.keys(x.insert)[0]
    const content = isText ? { text: x.insert } : x.insert[objKey]

    if (obj[`${content.type}Id`] === '') {
      obj[`${content.type}Id`] = content.id
    }
    if (objKey === 'image') {
      const reg = /^http(s)?:\/\/(.*?)\//
      // 传给后端数据去除host
      content.src = content.src.replace(reg, '/')
    }

    return { type: isText ? 'text' : objKey, content }
  })
  return obj
}
// 还原后台传输数据为Delta格式
export const resetFormat = data => {
  return new Delta(
    data.map(x => {
      let insert = {}
      if (x.type === 'text') {
        insert = x.content.text
      } else {
        insert[x.type] = x.content
      }
      return { insert }
    })
  )
}
