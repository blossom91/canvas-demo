// gua 框架赛高~~~
class Game {
    constructor(images, callback) {
        this.images = images
        this.canvas = document.querySelector('#game')
        this.context = this.canvas.getContext('2d')
        this.scene = null
        this.actions = {}
        this.keydowns = {}
        this.runCallback = callback
        window.addEventListener('keydown', event => {
            this.keydowns[event.key] = true
        })
        window.addEventListener('keyup', event => {
            this.keydowns[event.key] = false
        })
        this.init()
    }
    registerAction(key, callback) {
        this.actions[key] = callback
    }
    imageByName(name) {
        return this.images[name]
    }
    drawImage(img) {
        this.context.drawImage(img.image, img.x, img.y)
    }
    drawText(text, x, y) {
        this.context.font = '50px serif'
        this.context.fillText(text, x, y)
    }
    // update
    update() {
        this.scene.update()
    }
    // draw
    draw() {
        this.scene.draw()
    }
    runloop() {
        let actions = Object.keys(this.actions)
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i]
            if (this.keydowns[key]) {
                // 如果按键被按下, 调用注册的 action
                this.actions[key]()
            }
        }
        // update
        this.update()
        // clear
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // draw
        this.draw()
        // next run loop
        requestAnimationFrame(() => {
            this.runloop()
        })
    }
    runWithScene(scene) {
        this.scene = scene
        // 开始运行程序
        requestAnimationFrame(() => {
            this.runloop()
        })
    }
    replaceScene(scene) {
        this.scene = scene
    }
    __start() {
        this.runCallback(this)
    }
    init() {
        let num = 0
        let names = Object.keys(this.images)
        for (let i = 0; i < names.length; i++) {
            let name = names[i]
            let path = this.images[name]
            let img = new Image()
            img.src = path
            img.onload = () => {
                // 存入 g.images 中
                this.images[name] = img
                // 所有图片都成功载入之后, 调用 run
                num++
                if (num == names.length) {
                    this.__start()
                }
            }
        }
    }
}
