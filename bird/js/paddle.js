class Paddle {
    constructor(img, x, y, w) {
        this.img = img
        this.x = x || 0
        this.y = y || 0
        this.w = img.width
        this.h = img.height
        this.canvasW = w
        this.speed = 5
        this.timeOut = 0
    }

    move(x) {
        if (x <= 0) {
            this.x = 0
        } else if (x > this.canvasW - this.w) {
            this.x = this.canvasW - this.w
        } else {
            this.x = x
        }
    }

    moveLeft() {
        this.move(this.x - this.speed)
    }
    moveRight() {
        this.move(this.x + this.speed)
    }
    changeSpeed(speed) {
        this.speed = speed
    }
}
