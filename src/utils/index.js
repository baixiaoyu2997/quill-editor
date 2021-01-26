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

    if (obj[`${content['data-type']}Id`] === '') {
      obj[`${content['data-type']}Id`] = content['data-id']
    }
    if (objKey === 'image') {
      const reg = /^http(s)?:\/\/(.*?)\//
      // 传给后端数据去除host
      content.src = content.src.replace(reg, '/')
    }

    if (isText) {
      return { type: 'text', content }
    } else {
      // 去除data-*
      const deleteDataProps = content => {
        // eslint-disable-next-line prefer-const
        let newContent = {}
        Object.keys(content).forEach(
          key =>
            (newContent[
              key.startsWith('data-') ? key.replace('data-', '') : key
            ] = content[key])
        )
        return newContent
      }
      return { type: objKey, content: deleteDataProps(content) }
    }
  })
  return obj
}
export const switchTheme = theme => {
  const htmlEl = document.documentElement

  if (htmlEl.className !== '' || theme === 'light') {
    htmlEl.className = ''
  } else {
    htmlEl.className = 'dark-mode'
  }
}
