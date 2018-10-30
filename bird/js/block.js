class Block {
    constructor(img, o) {
        this.img = img
        this.x = o.x || 0
        this.y = o.y || 0
        this.w = img.width
        this.h = img.height
        this.alive = true
        this.lifes = o.life || 1
    }
    kill() {
        this.lifes--
        if (this.lifes === 0) {
            this.alive = false
        }
    }
}
