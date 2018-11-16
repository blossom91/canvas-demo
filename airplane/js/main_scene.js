class SceneMain extends BaseScene {
    constructor(game) {
        super(game)
        this.setup()
    }
    setup() {
        this.bg = new GameImage(this.game, 'bg')
        this.addElement(this.bg)
        this.enemyNum = 8
        this.nowEnemyNum = 0
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
        this.game.registerAction('p', () => {
            if (this.wait) return
            this.wait = true
            this.play = !this.play
            setTimeout(() => {
                this.wait = false
            }, 300)
            console.log('play', this.play)
        })
    }
    addEnemies() {
        let arr = 0
        for (let i = 0; i < this.enemyNum; i++) {
            let e = new Enemy(this.game, this)
            this.addElement(e)
            this.nowEnemyNum++
        }
    }

    update() {
        super.update()
        if (this.nowEnemyNum < this.enemyNum) {
            let e = new Enemy(this.game, this)
            this.addElement(e)
            this.nowEnemyNum++
        }
    }
}
