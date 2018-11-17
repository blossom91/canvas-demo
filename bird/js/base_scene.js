class BaseScene {
    constructor(game) {
        this.game = game
        this.score = 0
        this.elements = []
        this.play = true
        this.time = 100
    }
    draw() {
        for (let i = 0; i < this.elements.length; i++) {
            const e = this.elements[i]
            e.draw()
        }
        // 非标题页面显示分数
        if (!this.type) {
            this.game.drawScore(this.score)
        }
    }
    addElement(img) {
        if (img instanceof Array) {
            this.elements.push(...img)
        } else {
            this.elements.push(img)
        }
    }
    removeElement(img) {
        const index = this.elements.findIndex(e => e.id == img.id)
        if (index != -1) {
            console.log('remove index', index)
            this.elements.splice(index, 1)
        }
    }
    update() {
        if (!this.play) return
        if (!this.type) {
            this.time--
            if (this.time == 0) {
                this.score += 100
                this.time = 50
            }
        }
        for (let i = 0; i < this.elements.length; i++) {
            const e = this.elements[i]
            e.update()
            // 下面是碰撞检测
            if (e.id == 'bird') {
                for (let j = 0; j < this.elements.length; j++) {
                    const o = this.elements[j]
                    if (o.id == 'pipes') {
                        for (let k = 0; k < o.pipes.length; k++) {
                            const m = o.pipes[k]
                            if (isCrash(e, m)) {
                                // 相撞
                                let s = new SceneTitle(this.game, 2)
                                this.game.replaceScene(s)
                            }
                        }
                    }
                }
            }
        }
    }
}
