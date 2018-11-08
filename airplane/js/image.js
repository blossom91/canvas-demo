class GameImage {
    constructor(game, name) {
        this.game = game
        this.image = game.imageByName(name)
        this.x = 0
        this.y = 0
        this.w = this.image.width
        this.h = this.image.height
        this.life = 1
    }
    draw() {
        if (this.life > 0) {
            this.game.drawImage(this)
        }
    }
    update() {}
}
