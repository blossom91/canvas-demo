class BaseScene {
    constructor(game) {
        this.game = game
        this.score = 0
        this.elements = []
    }
    draw() {
        for (let i = 0; i < this.elements.length; i++) {
            const e = this.elements[i]
            e.draw()
        }
        this.game.drawScore(this.score)
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
        for (let i = 0; i < this.elements.length; i++) {
            const e = this.elements[i]
            e.update()
            if (e.id == 'player') {
                for (let j = 0; j < this.elements.length; j++) {
                    const o = this.elements[j]
                    if (o.id == 'enemy' || o.id == 'bullet2') {
                        if (isCrash(e, o)) {
                            // 自己的飞机与敌人飞机相撞或中子弹 自己飞机死亡
                            e.life--
                            o.life--
                        }
                    }
                }
            }
            if (e.id == 'enemy') {
                for (let j = 0; j < this.elements.length; j++) {
                    const o = this.elements[j]
                    if (o.id == 'bullet') {
                        if (isCrash(e, o)) {
                            // 敌人碰到子弹 敌人死掉  子弹消失
                            e.life--
                            o.life--
                        }
                    }
                }
            }
            if (e.id == 'bullet') {
                // 子弹对撞
                for (let j = 0; j < this.elements.length; j++) {
                    const o = this.elements[j]
                    if (o.id == 'bullet2') {
                        if (isCrash(e, o)) {
                            e.life--
                            o.life--
                        }
                    }
                }
            }
        }
        let arr = []
        for (let i = 0; i < this.elements.length; i++) {
            const e = this.elements[i]
            if (e.life > 0) {
                arr.push(e)
            } else {
                if (e.id != 'bullet2' && e.id != 'bullet') {
                    console.log(e)
                    let x = e.x + e.w / 2
                    let y = e.y + e.h / 2
                    const bomb = new Bomb(this.game, x, y, this)
                    this.addElement(bomb)
                }
                if (e.id == 'enemy') {
                    this.score += e.addScore * 100
                    this.nowEnemyNum--
                }
                if (e.id == 'player') {
                    let s = new SceneTitle(this.game, 2)
                    this.game.replaceScene(s)
                    console.log('game end')
                }
            }
        }
        this.elements = arr
    }
}
