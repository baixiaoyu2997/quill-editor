import './assets/css/normalize.css'
import './assets/css/index.css'
import './assets/css/quill.core.css'
import './assets/js/dsbridge.js'

const isDebugger = process.env.NODE_ENV==="development"
        
const Delta = Quill.import('delta');

var quill = new Quill('#editor', {
    scrollingContainer: 'scrolling-container',
    placeholder: '请输入正文',
});

const textareaEl = document.getElementById('title');
textareaEl.addEventListener("input", function (e) {
    this.style.height = "1.1em";
    this.style.height = this.scrollHeight+'px'
});

const quillMethods = () => {
    // production
    const getContents = () => {
        console.log({title:textareaEl.value,content:quill.getContents()})
        return {title:textareaEl.value,content:quill.getContents()}
    };
    // debugger
    const setImg = () => {
        quill.focus() // 防止插入图片时没有index
        const index = getFocus();
        quill.updateContents(new Delta().retain(index).insert('\n').insert({ image: 'https://placem.at/things?w=375&random=1' }).insert('\n'))
        quill.setSelection(index + 3)
    };
    const setText = (index, text) => {
        const testText =
            quill.insertText(index, text);
    };
    const getFocus = () => {
        console.log('==========获取焦点位置')
        console.log(quill.getSelection().index)
        return quill.getSelection().index;
    };
    const getLines = () => {
        console.log(quill.getLines(quill.getFocus()));
        return quill.getLines(quill.getFocus());
    }
    const getLength = () => {
        alert(quill.getLength())
        return quill.getLength()
    }
    const delText = () => {
        quill.deleteText(3, 3)
    }
    const getText = () => {
        console.log(quill.getContents())
        console.log(quill.getText())
        return quill.getText()
    }
    const setContents = () => {
        quill.setContents([
            { insert: 'Hello ' },
            { insert: 'World!', attributes: { bold: true } },
        ]);
    }
    const setFontSize = () => {
        quill.format('size', 'huge')
    }
    const onTextChange = (delta, oldDelta, source) => {
        if (source == 'api') {
            console.log("===============API");
        } else if (source == 'user') {
            console.log("===============User");
        }
    }
    const setSelection = () => {
        quill.setSelection(Math.floor(Math.random() * 10))
    }
    if (isDebugger) {
        document.querySelector('.test').classList.remove('test');
        Quill.debug(true)
        quill.on('text-change', onTextChange);
        return {
            setImg,
            setText,
            getFocus,
            getLines,
            getContents,
            delText,
            getLength,
            getText,
            setContents,
            setFontSize,
            onTextChange,
            setSelection
        }
    } else {
        return { getContents }
    }

}

const quillObj = quillMethods()

// bridge
// dsBridge.register('insertCoin', quillObj.xxx) // id,name
// dsBridge.register('insertTopic', quillObj.xxx) // id,name
// dsBridge.register('insertImage', quillObj.xxx) // id,filepath,name,url
dsBridge.register('getContent', quillObj.getContents)