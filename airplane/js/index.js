const __main = () => {
    let images = {
        bg: './airplane/img/background.png',
    }
    let game = new Game(images, g => {
        let s = new SceneMain(g)
        g.runWithScene(s)
    })
}
__main()
