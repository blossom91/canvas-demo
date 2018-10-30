class Ball {
    constructor(img, x, y, w) {
        this.img = img
        this.x = x || 0
        this.y = y || 0
        this.w = img.width
        this.h = img.height
        this.canvasW = w
        this.speedX = 5
        this.speedY = 5
        this.isCarsh = false
        this.draw = false
        const canvas = e('#game')
        bindEvent(canvas, 'mousedown', event => {
            const x = event.offsetX * 1.5 - this.w / 2 // 乘1.5是canvas内部坐标是样式大小的转换比例
            const y = event.offsetY * 1.5 - this.h / 2
            if (this.x + 5 > x && this.x - 5 < x && this.y + 5 > y && this.y - 5 < y) {
                this.draw = true
                console.log(this.draw)
            }
        })
        bindEvent(canvas, 'mousemove', event => {
            const x = event.offsetX * 1.5 - this.w / 2
            const y = event.offsetY * 1.5 - this.h / 2
            if (this.draw) {
                this.x = x
                this.y = y
            }
        })
        bindEvent(canvas, 'mouseup', event => {
            this.draw = false
            console.log(this.draw)
        })
    }

    move() {
        if (this.x <= 0 || this.x >= this.canvasW - this.w) {
            this.speedX *= -1
        }
        if (this.y <= 0 || this.isCarsh) {
            this.speedY *= -1
        }
        this.x += this.speedX
        this.y += this.speedY
    }

    carsh(bool) {
        this.isCarsh = bool
    }

    changeSpeed(speed) {
        this.speedX = (this.speedX / Math.abs(this.speedX)) * speed
        this.speedY = (this.speedY / Math.abs(this.speedY)) * speed
    }
}
