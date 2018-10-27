const isCrash = (rect1, rect2) =>
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y

class Paddle {
    constructor(img, x, y, w) {
        this.img = img
        this.x = x || 0
        this.y = y || 0
        this.w = img.width
        this.h = img.height
        this.canvasW = w
        this.speed = 5
        this.timeOut = 0
    }

    move(x) {
        if (x <= 0) {
            this.x = 0
        } else if (x > this.canvasW - this.w) {
            this.x = this.canvasW - this.w
        } else {
            this.x = x
        }
    }

    moveLeft() {
        this.move(this.x - this.speed)
    }
    moveRight() {
        this.move(this.x + this.speed)
    }
    changeSpeed(speed) {
        this.speed = speed
    }
}

class Ball {
    constructor(img, x, y, w) {
        this.img = img
        this.x = x || 0
        this.y = y || 0
        this.w = img.width
        this.h = img.height
        this.canvasW = w
        this.speedX = 5
        this.speedY = 5
        this.isCarsh = false
        this.draw = false
        window.addEventListener('mousedown', event => {
            const x = event.offsetX * 1.5 - this.w / 2 // 乘1.5是canvas内部坐标是样式大小的转换比例
            const y = event.offsetY * 1.5 - this.h / 2
            if (this.x + 5 > x && this.x - 5 < x && this.y + 5 > y && this.y - 5 < y) {
                this.draw = true
                console.log(this.draw)
            }
        })
        window.addEventListener('mousemove', event => {
            const x = event.offsetX * 1.5 - this.w / 2
            const y = event.offsetY * 1.5 - this.h / 2
            if (this.draw) {
                this.x = x
                this.y = y
            }
        })
        window.addEventListener('mouseup', event => {
            this.draw = false
            console.log(this.draw)
        })
    }

    move() {
        if (this.x <= 0 || this.x >= this.canvasW - this.w) {
            this.speedX *= -1
        }
        if (this.y <= 0 || this.isCarsh) {
            this.speedY *= -1
        }
        this.x += this.speedX
        this.y += this.speedY
    }

    carsh(bool) {
        this.isCarsh = bool
    }

    changeSpeed(speed) {
        this.speedX = (this.speedX / Math.abs(this.speedX)) * speed
        this.speedY = (this.speedY / Math.abs(this.speedY)) * speed
    }
}

class Block {
    constructor(img, o) {
        this.img = img
        this.x = o.x || 0
        this.y = o.y || 0
        this.w = img.width
        this.h = img.height
        this.alive = true
        this.lifes = o.life || 1
    }
    kill() {
        this.lifes--
        if (this.lifes === 0) {
            this.alive = false
        }
    }
}

class Draw {
    constructor(imgs) {
        this.score = 0
        this.imgs = imgs
        this.canvas = document.querySelector('#game')
        this.context = this.canvas.getContext('2d')
        this.blocks = []
        this.ball = null
        this.paddle = null
        this.level = 1
        this.keydowns = {}
        this.actions = {}
        this.play = false
        this.end = false
        this.success = false
        this.gameStart = false
        window.addEventListener('keydown', event => {
            this.keydowns[event.key] = true
        })
        window.addEventListener('keyup', event => {
            this.keydowns[event.key] = false
        })
    }
    registerAction(key, callback) {
        this.actions[key] = callback
    }
    imgByName(name) {
        const img = this.imgs[name]
        const o = {
            img,
            w: img.width,
            h: img.height,
        }
        return o
    }
    init() {
        let num = 0
        const imgKeys = Object.keys(this.imgs)
        for (let i = 0; i < imgKeys.length; i++) {
            const e = imgKeys[i]
            const img = new Image()
            img.src = this.imgs[e]
            img.onload = () => {
                this.imgs[e] = img
                num++
                if (num == imgKeys.length) {
                    this.start()
                }
            }
        }
    }
    gameEnd() {
        if (this.ball.y > this.canvas.height) {
            this.end = true
        }
    }
    start() {
        const paddle = this.imgByName('paddle')
        this.paddle = new Paddle(
            paddle.img,
            this.canvas.width / 2 - paddle.w / 2,
            this.canvas.height - paddle.h,
            this.canvas.width
        )
        const ball = this.imgByName('ball')

        this.ball = new Ball(
            ball.img,
            this.canvas.width / 2 - ball.w / 2,
            this.canvas.height - paddle.h - ball.h,
            this.canvas.width
        )

        const nowBlocks = blocks[this.level - 1]
        const arr = []
        for (let i = 0; i < nowBlocks.length; i++) {
            const e = nowBlocks[i]
            const img = this.imgByName('block')
            const block = new Block(img.img, e)
            arr.push(block)
        }
        this.blocks = arr
        this.render()
    }

    changeLevel(level) {
        this.level = level
        const nowBlocks = blocks[this.level - 1]
        const arr = []
        for (let i = 0; i < nowBlocks.length; i++) {
            const e = nowBlocks[i]
            const img = this.imgByName('block')
            const block = new Block(img.img, e)
            arr.push(block)
        }
        this.blocks = arr
    }
    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = '#554'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawImage(this.paddle)
        this.drawImage(this.ball)
        this.drawImage(this.blocks)
    }

    drawText() {
        this.context.font = '50px serif'
        if (this.success) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.fillText('恭喜您通关了', 150, 450)
        } else if (this.end) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.fillText('按 c 重新开始游戏', 150, 450)
        } else if (!this.gameStart) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.fillText('按 p 开始游戏', 150, 450)
        } else {
            this.context.font = '20px serif'
            this.context.fillStyle = 'black'
            this.context.fillText('分数' + this.score, this.canvas.width - 100, 20)
        }
    }

    drawImage(img) {
        if (img instanceof Array) {
            for (let i = 0; i < img.length; i++) {
                const e = img[i]
                if (e.alive) {
                    this.context.drawImage(e.img, e.x, e.y)
                }
            }
        } else {
            this.context.drawImage(img.img, img.x, img.y)
        }
    }

    render() {
        let actions = Object.keys(this.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            if (this.keydowns[key]) {
                // 如果按键被按下, 调用注册的 action
                this.actions[key]()
            }
        }
        // 这里检测碰撞逻辑
        this.ball.carsh(isCrash(this.ball, this.paddle))
        for (let i = 0; i < this.blocks.length; i++) {
            const e = this.blocks[i]
            if (e.alive) {
                if (isCrash(e, this.ball)) {
                    this.ball.carsh(true)
                    e.kill()
                    this.score += 100
                }
            }
        }
        const index = this.blocks.findIndex(e => e.alive == true)
        if (index === -1) {
            if (this.level == blocks.length) {
                this.success = true
            } else {
                this.changeLevel(this.level + 1)
            }
        }
        this.gameEnd()
        this.update()
        if (this.play) {
            this.ball.move()
        }
        this.drawText()
        this.timeOut = requestAnimationFrame(() => {
            this.render()
        })
    }
}
