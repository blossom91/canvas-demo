const createDraw = () => {
    let images = {
        ball: './brick/img/ball.png',
        block: './brick/img/block.png',
        paddle: './brick/img/paddle.png',
    }
    const draw = new Scene(images)

    draw.registerAction('a', () => {
        if (draw.play) {
            draw.paddle.moveLeft()
        }
    })
    draw.registerAction('d', () => {
        if (draw.play) {
            draw.paddle.moveRight()
        }
    })
    window.addEventListener('keydown', event => {
        if (event.key == 'p') {
            if (!draw.gameStart) {
                draw.gameStart = true
            }
            draw.play = !draw.play
        }
        if (event.key == 'c') {
            cancelAnimationFrame(draw.timeOut)
            draw.end = false
            draw.play = true
            draw.start()
        }
        if ('123456789'.includes(event.key)) {
            draw.changeLevel(event.key)
        }
    })
    return draw
}
const hanldeSpeed = draw => {
    const inputs = document.querySelectorAll('.change-input')
    inputs.forEach(e => {
        const key = e.dataset.name
        bindEvent(e, 'input', event => {
            draw[key].changeSpeed(Number(event.target.value))
        })
    })
}
const __main = () => {
    const draw = createDraw()
    hanldeSpeed(draw)
    draw.init()
}
__main()
