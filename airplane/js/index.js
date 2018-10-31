const config = {
    bullet_speed: 1,
    player_speed: 1,
    enemy_speed: 1,
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
        html += `
        <label for="">
        ${item}
        <input type="range" max='10'  value="${config[item]}" data-speed="${item}">
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
    }
    render()
    speedBind()
    let game = new Game(images, g => {
        let s = new SceneMain(g)
        g.runWithScene(s)
    })
}
__main()
