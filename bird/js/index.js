// 小鸟完整版本（包含完整游戏功能和标题、结束场景）
// 1.循环移动的地面
// 2.小鸟正常移动
// 3.管子处理
const config = {
    pipe_X: 250,
    pipe_Y: 150,
    pipe_Up: 270,
    bird_speed: 5,
    jump_height: 5,
}

const render = function(params) {
    let html = ''
    const arr = Object.keys(config)
    arr.forEach(item => {
        let max = 10
        let min = 1
        if (item == 'pipe_Up') {
            max = 300
            min = 200
        }
        if (item == 'pipe_X') {
            max = 300
            min = 200
        }
        if (item == 'pipe_Y') {
            max = 200
            min = 100
        }
        html += `
        <label for="">
        ${item}
        <input type="range" max='${max}'  min='${min}'  value="${config[item]}" data-speed="${item}">
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
        bg: './bird/img/bg_day.png',
        bird0: './bird/img/bird0_0.png',
        bird1: './bird/img/bird0_1.png',
        bird2: './bird/img/bird0_2.png',
        pipe: './bird/img/pipe_up.png',
        land: './bird/img/land.png',
        title: './bird/img/title.png',
        ready: './bird/img/text_ready.png',
        end: './bird/img/text_game_over.png',
    }
    render()
    speedBind()
    let game = new Game(images, g => {
        let s = new SceneTitle(g)
        // let s = new SceneMain(g)

        g.runWithScene(s)
    })
}
__main()
