// 简单的检测碰撞函数
const isCrash = (rect1, rect2) =>
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
// 主绘制函数
class Scene {
    constructor(imgs) {
        this.score = 0
        this.imgs = imgs
        this.canvas = e('#game')
        this.context = this.canvas.getContext('2d')
        this.blocks = []
        this.ball = null
        this.paddle = null
        this.level = 1
        this.isEditor = false
        this.editor = null
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
        console.log('blocks', blocks)
        const nowBlocks = blocks[this.level - 1]
        const arr = []
        for (let i = 0; i < nowBlocks.length; i++) {
            const e = nowBlocks[i]
            const img = this.imgByName('block')
            const block = new Block(img.img, e)
            arr.push(block)
        }
        this.blocks = arr
        this.editor = new Editor(this)
        this.render()
    }

    changeLevel(level) {
        this.level = level
        const nowBlocks = blocks[this.level - 1]
        const arr = []
        if (nowBlocks && nowBlocks.length) {
            for (let i = 0; i < nowBlocks.length; i++) {
                const e = nowBlocks[i]
                const img = this.imgByName('block')
                const block = new Block(img.img, e)
                arr.push(block)
            }
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

    updateEditor() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = '#554'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.changeLevel(this.level)
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
            this.context.fillText('关卡: ' + this.level + '分数: ' + this.score, this.canvas.width - 150, 20)
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
        if (this.isEditor) {
            this.updateEditor()
        } else {
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
        }
        this.timeOut = requestAnimationFrame(() => {
            this.render()
        })
    }
}
