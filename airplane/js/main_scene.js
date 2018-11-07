const random = (start, end) => {
    const num = Math.random() * (end - start + 1)
    return Math.floor(num + start)
}

class Bullet extends GameImage {
    constructor(game, x, y) {
        super(game, 'bullet')
        this.setup(x, y)
    }
    setup(x, y) {
        this.x = x
        this.y = y
        this.speed = config.bullet_speed
    }
    update() {
        this.y -= this.speed
    }
}

class Player extends GameImage {
    constructor(game) {
        super(game, 'player')
        this.setup()
    }
    setup() {
        this.cooldown = config.bullet_interval
    }
    update() {
        if (this.cooldown > 0) {
            this.cooldown--
        }
    }

    fire(scene) {
        console.log(this.cooldown)
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
            this.x -= config.player_speed
        }
    }
    moveRight() {
        if (this.x + this.w < this.game.canvas.width) {
            console.log(config.player_speed)
            this.x += config.player_speed
            console.log(this.x)
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
    constructor(game) {
        let num = random(0, 2) // 降低大型飞机的出现概率
        if (num == 2) {
            num = random(0, 2)
            num = random(0, 2)
        }
        const name = 'enemy' + num
        super(game, name)
        this.setup()
    }
    setup() {
        this.y = -random(0, 300)
        this.x = random(0, 480 - this.w)
    }
    update() {
        if (this.y > this.game.canvas.height) {
            this.setup()
        } else {
            this.y += config.enemy_speed
        }
    }
}

class SceneMain extends BaseScene {
    constructor(game) {
        super(game)
        this.setup()
    }
    setup() {
        this.bg = new GameImage(this.game, 'bg')
        this.addElement(this.bg)
        this.enemyNum = 8

        this.player = new Player(this.game)
        this.player.x = 200
        this.player.y = 700
        this.addElement(this.player)
        this.addEnemies()
        this.game.registerAction('a', () => {
            this.player.moveLeft()
        })
        this.game.registerAction('d', () => {
            this.player.moveRight()
        })
        this.game.registerAction('w', () => {
            this.player.moveUp()
        })
        this.game.registerAction('s', () => {
            this.player.moveDown()
        })
        this.game.registerAction('j', () => {
            this.player.fire(this)
        })
    }
    addEnemies() {
        let arr = []
        for (let i = 0; i < this.enemyNum; i++) {
            let e = new Enemy(this.game)
            this.addElement(e)
            arr.push(e)
        }
        this.enemies = arr
    }
    // draw() {
    //     this.game.drawImage(this.bg)
    //     this.game.drawImage(this.player)
    // }
}
