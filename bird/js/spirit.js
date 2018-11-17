class Land extends GameImage {
    constructor(game, x, y) {
        super(game, 'land')
        this.setup()
    }
    setup(x, y) {
        this.x = 0
        this.y = 400
        this.speed = 5
    }
    update() {
        this.x -= this.speed
        if (this.x < -40) {
            this.x = 0
        }
    }
}

class Pipes {
    constructor(game) {
        this.game = game
        this.setup()
    }
    setup() {
        this.intervalY = config.pipe_Y
        this.intervalX = config.pipe_X
        this.pipes = []
        this.pipeCount = 3
        this.id = 'pipes'
        for (let i = 0; i < this.pipeCount; i++) {
            const p1 = new GameImage(this.game, 'pipe')
            p1.flip = true
            p1.x = 500 + i * this.intervalX
            const p2 = new GameImage(this.game, 'pipe')
            p2.x = p1.x
            this.pipeForY(p1, p2)
            this.pipes.push(p1, p2)
        }
    }
    pipeForY(p1, p2) {
        p1.y = random(-config.pipe_Up, 0)
        p2.y = p1.y + p1.h + this.intervalY
    }
    update() {
        for (let i = 0; i < this.pipes.length / 2; i += 2) {
            const p1 = this.pipes[i]
            const p2 = this.pipes[i + 1]
            p1.x -= 5
            if (p1.x < -100) {
                p1.x += (this.pipeCount - 1) * this.intervalX
            }
            p2.x -= 5
            if (p2.x < -100) {
                p2.x += (this.pipeCount - 1) * this.intervalX
                this.pipeForY(p1, p2)
            }
        }
    }
    draw() {
        for (let i = 0; i < this.pipes.length; i++) {
            const pipe = this.pipes[i]
            let context = this.game.context
            context.save()
            let w = pipe.w / 2
            let h = pipe.h / 2
            context.translate(pipe.x + w, pipe.y + h)
            if (pipe.flip) {
                context.scale(1, -1)
            }
            context.translate(-w, -h)
            context.drawImage(pipe.image, 0, 0)
            context.restore()
        }
    }
}

class Bird {
    constructor(game, x, y) {
        this.game = game
        this.x = x || 120
        this.y = y || 100
        this.setup()
    }
    setup() {
        const birdList = Object.keys(this.game.images).filter(e => e.includes('bird'))
        this.frames = birdList.map(e => this.game.imageByName(e))
        this.frameIndex = 0
        this.frequency = 2
        this.vy = 1
        this.vg = 10
        this.flip = false
        this.rotation = 0
        this.id = 'bird'
    }
    showFrame() {
        this.image = this.frames[this.frameIndex]
        this.w = this.image.width
        this.h = this.image.height
    }
    moveLeft() {
        if (this.x > 0) {
            this.flip = true
            this.x -= config.bird_speed
        }
    }
    moveRight() {
        if (this.x + this.w < this.game.canvas.width) {
            this.flip = false
            this.x += config.bird_speed
        }
    }
    jump() {
        this.rotation = -45
        if (this.y - 5 > this.h / 2) {
            this.vy = -config.jump_height
        }
    }
    draw() {
        this.showFrame()
        let context = this.game.context
        context.save()
        let w = this.w / 2
        let h = this.h / 2
        context.translate(this.x + w, this.y + h)
        if (this.flip) {
            context.scale(-1, 1)
        }
        context.rotate((this.rotation * Math.PI) / 180)
        context.translate(-w, -h)
        context.drawImage(this.image, 0, 0)
        context.restore()
    }
    update() {
        if (this.y < 352.1 || this.vy < 0) {
            this.y += this.vy
            this.vy += this.vg * 0.03
        }
        if (this.rotation < 45) {
            this.rotation += 3
        }
        this.frequency--
        if (this.frequency == 0) {
            if (this.frameIndex + 1 < this.frames.length) {
                this.frameIndex++
            } else {
                this.frameIndex = 0
            }
            this.frequency = 2
        }
    }
}
