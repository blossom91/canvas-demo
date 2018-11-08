class SceneTitle extends BaseScene {
    constructor(game) {
        super(game)
        this.setup()
    }
    setup() {
        this.game.registerAction('k', () => {
            console.log('开始游戏')
            let s = new SceneMain(game)
            game.replaceScene(s)
        })
        const bomb = new Bomb(this.game, 0, 0, this)
        this.addElement(bomb)
    }
    // draw() {
    //     // this.game.drawText('开始游戏', 100, 100)
    // }
    // update() {

    // }
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
