class SceneTitle extends BaseScene {
    constructor(game, type) {
        super(game)
        this.type = type || 1
        this.setup()
    }
    setup(text) {
        this.game.registerAction('k', () => {
            console.log('开始游戏')
            let s = new SceneMain(this.game)
            this.game.replaceScene(s)
        })
    }
    draw() {
        if (this.type == 1) {
            this.game.drawText('点击K开始游戏', 80, 400)
        } else {
            this.game.drawText('game over!', 100, 400)
        }
    }
    update() {}
}
