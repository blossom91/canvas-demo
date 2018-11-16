// 打飞机完成版（包含双方子弹碰撞、敌机碰撞、爆炸效果）
const config = {
    player_speed: 5,
    bullet_speed: 5,
    enemy_speed: 2,
    enemy_bullet_speed: 5,
    bullet_interval: 6,
    enemy_interval: 100,
    bomb_time: 20,
}

const render = function(params) {
    let html = ''
    const arr = Object.keys(config)
    arr.forEach(item => {
        let max = 10
        if (item == 'bullet_interval') {
            max = 30
        }
        if (item == 'bomb_time') {
            max = 100
        }
        html += `
        <label for="">
        ${item}
        <input type="range" max='${max}'  value="${config[item]}" data-speed="${item}">
        <span>${config[item]}</span>
        </label>
        `
    })
    const dom = e('.input-list')
    dom.insertAdjacentHTML('beforeend', html)
}

const speedBind = () => {
    bindAll('input', 'input', event => {
        const target = event.target
        const data = target.dataset.speed
        config[data] = parseInt(target.value)
        const span = target.parentElement.children[1]
        span.innerText = target.value
    })
}

const __main = () => {
    let images = {
        bg: './airplane/img/background.png',
        player: './airplane/img/hero2.png',
        enemy0: './airplane/img/enemy0.png',
        enemy1: './airplane/img/enemy1.png',
        enemy2: './airplane/img/enemy2.png',
        bullet: './airplane/img/bullet.png',
        bullet2: './airplane/img/bullet2.png',
        spark: './airplane/img/bullet1.png',
    }
    render()
    speedBind()
    let game = new Game(images, g => {
        let s = new SceneTitle(g)
        g.runWithScene(s)
    })
}
__main()
