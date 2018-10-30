class GameImage {
    constructor(game, name) {
        this.image = game.imageByName(name)
        this.x = 0
        this.y = 0
        this.w = this.image.width
        this.h = this.image.height
    }
    draw() {}
    update() {}
}
