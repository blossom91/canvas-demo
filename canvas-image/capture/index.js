const html2canvas = require('html2canvas')
const { render } = require('./render')
const { parse, loadResources } = require('./node')

exports.toCanvas = function toCanvas(node, options) {
    let nodeCt = parse(node)
    return loadResources(nodeCt).then(() => render(nodeCt, options))
}

exports.htmlTocanvas = function htmlTocanvas(node, options) {
    return html2canvas(node).then(canvas => canvas)
}

exports.getPNGImage = function getPNGImage(canvas) {
    // 消除canvas空白
    return new Promise((resolve, reject) => {
        let imgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
        let lOffset = canvas.width,
            rOffset = 0,
            tOffset = canvas.height,
            bOffset = 0
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                let pos = (i + canvas.width * j) * 4
                if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
                    bOffset = Math.max(j, bOffset) // 找到有色彩的最底部的纵坐标
                    rOffset = Math.max(i, rOffset) // 找到有色彩的最右端
                    tOffset = Math.min(j, tOffset) // 找到有色彩的最上端
                    lOffset = Math.min(i, lOffset) // 找到有色彩的最左端
                }
            }
        }
        lOffset++
        rOffset++
        // tOffset++
        // tOffset--
        bOffset++
        let result = {},
            devicePixelRatio = window.devicePixelRatio,
            picWidth = rOffset - lOffset,
            picHeight = bOffset - tOffset,
            smallCvs = document.createElement('canvas'),
            smallCtx = smallCvs.getContext('2d'),
            img = new Image(canvas.width, canvas.height)
        img.src = canvas.toDataURL('image/png')
        smallCvs.width = picWidth
        smallCvs.height = picHeight
        img.onload = function() {
            smallCtx.drawImage(img, lOffset, tOffset, picWidth, picHeight, 0, 0, picWidth, picHeight)
            resolve(smallCvs.toDataURL('image/png'))
        }
    })
}
