class BaseScene {
    constructor(game) {
        this.game = game
        this.elements = []
    }
    draw() {
        for (let i = 0; i < this.elements.length; i++) {
            const e = this.elements[i]
            this.game.drawImage(e)
        }
    }
    addElement(img) {
        if (img instanceof Array) {
            this.elements.push(...img)
        } else {
            this.elements.push(img)
        }
    }
    update() {
        for (let i = 0; i < this.elements.length; i++) {
            const e = this.elements[i]
            e.update()
        }
    }
}
