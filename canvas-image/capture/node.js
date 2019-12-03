const html2canvas = require('html2canvas')

const REG_MATRIX = /(matrix|matrix3d)\((.+)\)/

// 解析node
exports.parse = function parse(node) {
    let nodeCt = parseNode(node)
    if (!nodeCt) {
        return
    }
    if (nodeCt.render === 'html2canvas') {
        return nodeCt
    }
    for (let i = 0, len = node.childNodes.length; i < len; i++) {
        let child = node.childNodes[i]
        let childCt = parse(child)
        if (childCt) {
            childCt.parent = nodeCt
            nodeCt.children.push(childCt)
        }
    }
    nodeCt.children.sort((a, b) => a.zIndex - b.zIndex)
    return nodeCt
}

exports.loadResources = function loadResources(nodeCt, promises) {
    if (!nodeCt.visible) {
        return
    }
    let root = !promises
    if (!promises) {
        promises = []
    }

    if (nodeCt.imageUrl && !nodeCt.image) {
        promises.push(
            new Promise((resolve, reject) => {
                nodeCt.image = new Image()
                nodeCt.image.src = nodeCt.imageUrl
                nodeCt.image.onload = resolve
                nodeCt.image.onerror = reject
            })
        )
    } else if (nodeCt.render === 'html2canvas') {
        promises.push(
            html2canvas(nodeCt.node, { logging: false, backgroundColor: null, async: true })
                .then(canvas => {
                    nodeCt.image = canvas
                })
                .catch(error => {
                    console.error(error)
                })
        )
    }

    nodeCt.children.forEach(childCt => {
        loadResources(childCt, promises)
    })

    if (root) {
        return Promise.all(promises)
    }
}

function parseNode(node) {
    if (node instanceof HTMLElement) {
        let nodeCt = createNodeContainer(node)
        let style = getComputedStyle(node)
        parseVisible(nodeCt, style)
        if (!nodeCt.visible) {
            return nodeCt
        }
        let parsers = [
            parseZIndex,
            parseSize,
            parsePosition,
            parseMargin,
            parsePadding,
            parseBackground,
            parseImage,
            parseTransformOrigin,
            parseTransform,
            parseBorder,
            parseLineHeight,
        ]
        parsers.forEach(parser => parser(nodeCt, style))
        return nodeCt
    } else {
        let nodeCt = createNodeContainer(node)
        if (node instanceof Comment) {
            return
        }
        if (node instanceof Text) {
            if (!node.textContent || !node.textContent.trim()) {
                return
            }
            nodeCt.render = 'text'
            parseText(nodeCt)
        }
        return nodeCt
    }
}

function createNodeContainer(node) {
    return {
        node,
        parent: null,
        render: node.getAttribute && node.getAttribute('data-render'),
        visible: true,
        unsupported: false,
        zIndex: 0,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        matrix: null,
        origin: null,
        imageUrl: null,
        image: null,
        opacity: 1,
        margin: [0, 0, 0, 0],
        padding: [0, 0, 0, 0],
        lineHeight: 0,
        background: {
            color: null,
        },
        border: {
            width: 0,
            radius: 0,
            color: null,
        },
        text: {
            content: '',
            fontSize: '',
            fontFamily: '',
            fontWeight: '',
            color: '',
            width: 0,
            height: 0,
            align: 'left',
        },
        children: [],
    }
}

function toFloat(s) {
    return parseFloat(s.trim())
}

function parseVisible(nodeCt, style) {
    nodeCt.visible = style.visibility === 'visible' && style.display !== 'none' && toFloat(style.opacity) > 0
    nodeCt.opacity = toFloat(style.opacity)
}

function parseZIndex(nodeCt, style) {
    nodeCt.zIndex = toFloat(style.zIndex) || 0
}

function parseSize(nodeCt, style) {
    nodeCt.width = nodeCt.node.clientWidth
    nodeCt.height = nodeCt.node.clientHeight
}

function parsePosition(nodeCt, style) {
    nodeCt.left = toFloat(style.left) || 0
    nodeCt.top = toFloat(style.top) || 0
}

function parseBackground(nodeCt, style) {
    nodeCt.background.color = style.backgroundColor
}

function parseMargin(nodeCt, style) {
    nodeCt.margin[0] = toFloat(style.marginLeft)
    nodeCt.margin[1] = toFloat(style.marginTop)
    nodeCt.margin[2] = toFloat(style.marginRight)
    nodeCt.margin[3] = toFloat(style.marginBottom)
}

function parsePadding(nodeCt, style) {
    nodeCt.padding[0] = toFloat(style.paddingLeft)
    nodeCt.padding[1] = toFloat(style.paddingTop)
    nodeCt.padding[2] = toFloat(style.paddingRight)
    nodeCt.padding[3] = toFloat(style.paddingBottom)
}

function parseImage(nodeCt, style) {
    switch (nodeCt.node.tagName) {
        case 'IMG':
            nodeCt.imageUrl = nodeCt.node.src
            break
        case 'CANVAS':
            nodeCt.image = nodeCt.node
            break
    }
}

function parseTransformOrigin(nodeCt, style) {
    let origin = style.transformOrigin
    if (typeof origin !== 'string') {
        nodeCt.origin = [0, 0]
    } else {
        const values = origin.split(' ')
        nodeCt.origin = [toFloat(values[0]), toFloat(values[1])]
    }
}

function parseTransform(nodeCt, style) {
    const match = style.transform.match(REG_MATRIX)
    let matrix = null
    if (match) {
        if (match[1] === 'matrix') {
            matrix = match[2].split(',').map(toFloat)
            matrix = [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]]
        } else {
            const matrix3d = match[2].split(',').map(toFloat)
            matrix = [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]]
        }
    } else {
        matrix = [1, 0, 0, 1, 0, 0]
    }
    nodeCt.matrix = matrix
}

function parseBorder(nodeCt, style) {
    nodeCt.border.width = toFloat(style.borderWidth)
    nodeCt.border.radius = toFloat(style.borderRadius)
    nodeCt.border.color = style.borderColor
}

function parseText(nodeCt) {
    let parentNode = nodeCt.node.parentNode
    nodeCt.text.content = nodeCt.node.textContent
    let style = getComputedStyle(parentNode)
    nodeCt.text.color = style.color
    nodeCt.text.fontSize = style.fontSize
    nodeCt.text.fontFamily = style.fontFamily
    nodeCt.text.fontWeight = style.fontWeight
    nodeCt.text.width = toFloat(style.width)
    nodeCt.text.height = toFloat(style.height)
    nodeCt.text.align = style.textAlign
}

function parseLineHeight(nodeCt, style) {
    nodeCt.lineHeight = toFloat(style.lineHeight)
}
