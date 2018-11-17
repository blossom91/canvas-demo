class SceneTitle extends BaseScene {
    constructor(game, type) {
        super(game)
        this.type = type || 1 // 根据类型显示画面
        this.setup()
    }
    setup(text) {
        this.bg = new GameImage(this.game, 'bg')
        this.addElement(this.bg)
        this.title = new GameImage(this.game, 'title', 60, 80)
        this.addElement(this.title)
        if (this.type == 1) {
            this.ready = new GameImage(this.game, 'ready', 60, 250)
            this.addElement(this.ready)
        } else {
            this.end = new GameImage(this.game, 'end', 60, 250)
            this.addElement(this.end)
        }
        this.game.registerAction('k', () => {
            if (this.wait) return
            console.log('开始游戏')
            this.wait = true
            let s = new SceneMain(this.game)
            this.game.replaceScene(s)
            setTimeout(() => {
                this.wait = false
            }, 300)
        })
    }
}
