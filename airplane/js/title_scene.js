class SceneTitle extends BaseScene {
    constructor(game) {
        super(game)
        game.registerAction('k', () => {
            console.log('开始游戏')
            let s = new Scene(game)
            game.replaceScene(s)
        })
    }
    draw() {
        this.game.context.fillText('按 k 开始游戏', 100, 190)
    }
}
