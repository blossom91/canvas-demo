class Bullet extends GameImage {
    constructor(game, x, y) {
        super(game, 'bullet')
        this.setup(x, y)
    }
    setup(x, y) {
        this.id = 'bullet'
        this.x = x
        this.y = y
        this.speed = config.bullet_speed
    }
    update() {
        this.y -= this.speed
    }
}

class EnemyBullet extends GameImage {
    constructor(game, x, y) {
        super(game, 'bullet2')
        this.setup(x, y)
    }
    setup(x, y) {
        this.id = 'bullet2'
        this.x = x
        this.y = y
        this.speed = config.enemy_bullet_speed
    }
    update() {
        this.y += this.speed
    }
}

class Player extends GameImage {
    constructor(game) {
        super(game, 'player')
        this.setup()
    }
    setup() {
        this.id = 'player'
        this.cooldown = config.bullet_interval
    }
    update() {
        if (this.cooldown > 0) {
            this.cooldown--
        }
    }
    fire(scene) {
        if (this.cooldown == 0) {
            this.cooldown = config.bullet_interval
            let x = this.x + this.w / 2 - 10
            let y = this.y - 15
            let bullet = new Bullet(this.game, x, y)
            scene.addElement(bullet)
        }
    }

    moveLeft() {
        if (this.x > 0) {
            console.log('config.player_speed', config.player_speed)
            this.x -= config.player_speed
        }
    }
    moveRight() {
        if (this.x + this.w < this.game.canvas.width) {
            this.x += config.player_speed
        }
    }
    moveUp() {
        if (this.y > 0) {
            this.y -= config.player_speed
        }
    }
    moveDown() {
        if (this.y + this.h < this.game.canvas.height) {
            this.y += config.player_speed
        }
    }
}

class Enemy extends GameImage {
    constructor(game, scene) {
        let num = random(0, 2) // 降低大型飞机的出现概率
        if (num == 2) {
            num = random(0, 2)
            num = random(0, 2)
        }
        const name = 'enemy' + num
        super(game, name)
        this.addScore = num + 1
        this.scene = scene
        this.life = num + 1
        this.id = 'enemy'
        this.setup()
    }
    setup() {
        this.y = -random(0, 300)
        this.x = random(0, 480 - this.w)
        this.cooldown = 100
    }
    fire() {
        if (this.cooldown == 0) {
            this.cooldown = 100
            let x = this.x + this.w / 2 - 10
            let y = this.y - 15
            let bullet = new EnemyBullet(this.game, x, y)
            this.scene.addElement(bullet)
        }
    }
    update() {
        if (this.cooldown > 0) {
            this.cooldown--
        }
        this.fire()
        if (this.y > this.game.canvas.height) {
            this.setup()
        } else {
            this.y += config.enemy_speed
        }
    }
}

class Spark extends GameImage {
    constructor(game, x, y) {
        super(game, 'spark')
        this.setup(x, y)
    }
    setup(x, y) {
        this.x = x
        this.y = y
        this.vx = random(-1, 1)
        this.vy = random(-1, 1)
        this.life = 10
    }
    update() {
        this.life--
        this.x += this.vx
        this.y += this.vy
    }
    draw() {
        this.game.context.drawImage(this.image, this.x, this.y, 6, 6)
    }
}

class Bomb {
    constructor(game, x, y, scene) {
        this.scene = scene
        this.game = game
        this.setup(x, y)
    }
    setup(x, y) {
        this.id = new Date().getTime()
        this.x = x
        this.y = y
        this.sparkArr = []
        this.sparkNum = 30
        this.life = config.bomb_time
    }

    update() {
        this.life--
        if (this.life < 0) {
            this.scene.removeElement(this)
        }
        if (this.sparkArr.length < this.sparkNum) {
            const e = new Spark(this.game, this.x, this.y)
            this.sparkArr.push(e)
        }
        for (let i = 0; i < this.sparkArr.length; i++) {
            const e = this.sparkArr[i]
            e.update()
            if (e.life < 0) {
                this.sparkArr.splice(i, 1)
            }
        }
    }

    draw() {
        for (let i = 0; i < this.sparkArr.length; i++) {
            const e = this.sparkArr[i]
            e.draw()
        }
    }
}
