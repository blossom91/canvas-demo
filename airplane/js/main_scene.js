class SceneMain extends BaseScene {
    constructor(game) {
        super(game)
        this.bg = new GameImage(game, 'bg')
    }
    draw() {
        this.game.drawImage(this.bg)
    }
}
