exports.render = function render(nodeCt, options) {
    if (!options) {
        options = {}
    }
    if (!options.resolution) {
        options.resolution = window.devicePixelRatio
    }
    let canvas = document.createElement('canvas')
    canvas.width = nodeCt.width * options.resolution
    canvas.height = nodeCt.height * options.resolution
    let context = canvas.getContext('2d')
    context.scale(options.resolution, options.resolution)
    nodeCt.children.forEach(childCt => renderNode(childCt, canvas, context, options))
    return canvas
}

function renderNode(nodeCt, canvas, context, options) {
    if (nodeCt.opacity <= 0) {
        return
    }

    if (nodeCt.unsupported) {
        return
    }

    if (!nodeCt.visible) {
        return
    }

    let origin = nodeCt.origin
    let tagName = nodeCt.node.tagName
    let mat = nodeCt.matrix

    context.save()
    context.globalAlpha *= nodeCt.opacity
    context.translate(nodeCt.left, nodeCt.top)
    context.translate(nodeCt.margin[0], nodeCt.margin[1])

    let drawImage = false
    switch (tagName) {
        case 'CANVAS':
        case 'IMG':
            let img = nodeCt.image
            if (img.width === 0 || img.height === 0) {
                break
            }
            drawImage = true
            break
    }

    if (drawImage) {
        let img = nodeCt.image
        context.translate(origin[0], origin[1])
        context.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5])
        context.drawImage(img, 0, 0, img.width, img.height, -origin[0], -origin[1], nodeCt.width, nodeCt.height)
    } else {
        if (nodeCt.render === 'text') {
            // render text
            context.save()
            context.fillStyle = nodeCt.text.color
            context.textBaseline = 'middle'
            context.textAlign = nodeCt.text.align

            let fontSize = parseFloat(nodeCt.text.fontSize)
            let fontScale = 1
            if (fontSize < 10) {
                nodeCt.text.fontSize = '12px'
                fontScale = fontSize / 12
            }

            context.font = nodeCt.text.fontSize + ' ' + nodeCt.text.fontWeight + ' ' + nodeCt.text.fontFamily
            let y = nodeCt.parent.lineHeight / 2
            let x = 0
            switch (nodeCt.text.align) {
                case 'end':
                case 'right':
                    x = nodeCt.text.width
                    break
                case 'center':
                    x = nodeCt.text.width / 2
                    break
            }
            context.translate(x, y)
            if (fontScale !== 1) {
                context.scale(fontScale, fontScale)
            }

            context.fillText(nodeCt.text.content, 0, 0)
            context.restore()
        } else if (nodeCt.render === 'bubble-tail') {
            context.save()
            context.fillStyle = '#FFFFFF'
            context.beginPath()
            context.arc(17, 2, 8, -Math.PI / 2, Math.PI / 2, false)
            context.lineTo(17, 0)
            context.closePath()
            context.fill()
            context.restore()
        } else {
            let shouldRender = !(nodeCt.background.color === 'rgba(0, 0, 0, 0)' && nodeCt.border.width === 0)

            context.translate(origin[0], origin[1])
            context.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5])

            if (shouldRender) {
                context.lineWidth = nodeCt.border.width
                context.lineStyle = nodeCt.border.color
                context.fillStyle = nodeCt.background.color
                if (nodeCt.border.radius) {
                    if (nodeCt.border.radius > nodeCt.height / 2) {
                        nodeCt.border.radius = nodeCt.height / 2
                    }
                    // console.log(-origin[0], -origin[1], nodeCt.width, nodeCt.height, nodeCt.border.radius)
                    roundRect(
                        context,
                        -origin[0],
                        -origin[1],
                        nodeCt.width,
                        nodeCt.height,
                        nodeCt.border.radius,
                        true,
                        nodeCt.border.width > 0
                    )
                } else {
                    context.beginPath()
                    context.rect(-origin[0], -origin[1], nodeCt.width, nodeCt.height)
                    context.closePath()
                    context.fill()
                    if (nodeCt.border.width > 0) {
                        context.stroke()
                    }
                }
            }
            context.translate(-origin[0], -origin[1])
        }
    }

    context.translate(nodeCt.padding[0], nodeCt.padding[1])
    nodeCt.children.forEach(childCt => renderNode(childCt, canvas, context, options))
    context.restore()
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true
    }
    if (typeof radius === 'undefined') {
        radius = 5
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius }
    } else {
        let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
        for (let side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side]
        }
    }
    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
    if (fill) {
        ctx.fill()
    }
    if (stroke) {
        ctx.stroke()
    }
}
