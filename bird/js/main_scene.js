class SceneMain extends BaseScene {
    constructor(game) {
        super(game)
        this.setup()
    }
    setup() {
        this.bg = new GameImage(this.game, 'bg')
        this.addElement(this.bg)
        this.player = new Bird(this.game)
        this.addElement(this.player)
        this.land = new Land(this.game)
        this.addElement(this.land)
        this.pipes = new Pipes(this.game)
        this.addElement(this.pipes)
        this.game.registerAction('a', () => {
            this.player.moveLeft()
        })
        this.game.registerAction('d', () => {
            this.player.moveRight()
        })
        this.game.registerAction('j', () => {
            this.player.jump()
        })
        this.game.registerAction('p', () => {
            if (this.wait) return
            this.wait = true
            this.play = !this.play
            setTimeout(() => {
                this.wait = false
            }, 300)
        })
    }
}
