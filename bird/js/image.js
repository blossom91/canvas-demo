class GameImage {
    constructor(game, name, x, y) {
        this.id = name
        this.game = game
        this.image = game.imageByName(name)
        this.x = x || 0
        this.y = y || 0
        this.w = this.image.width
        this.h = this.image.height
    }
    draw() {
        this.game.drawImage(this)
    }
    update() {}
}
