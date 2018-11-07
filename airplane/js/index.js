// 打飞机完成版（包含双方子弹碰撞、敌机碰撞、爆炸效果）
const config = {
    bullet_speed: 5,
    player_speed: 5,
    enemy_speed: 2,
    bullet_interval: 6,
}

const e = selector => document.querySelector(selector)

const bindEvent = (element, eventName, callback) => {
    element.addEventListener(eventName, callback)
}

const bindAll = (selector, eventName, callback) => {
    let elements = document.querySelectorAll(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}
const render = function(params) {
    let html = ''
    const arr = Object.keys(config)
    arr.forEach(item => {
        let max = 10
        if (item == 'bullet_interval') {
            max = 30
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
        spark: './airplane/img/bullet1.png',
    }
    render()
    speedBind()
    let game = new Game(images, g => {
        let s = new SceneMain(g)
        g.runWithScene(s)
    })
}
__main()
