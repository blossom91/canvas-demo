// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs')
let express = require('express')
let bodyParser = require('body-parser')
let OSS = require('ali-oss')
let app = express()
let server = require('http').createServer(app)

app.use(bodyParser.json({ limit: '1mb' })) // body-parser 解析json格式数据
app.use(
    bodyParser.urlencoded({
        // 此项必须在 bodyParser.json 下面,为参数编码
        extended: true,
    })
)
const config = require('./config').config

const { loadAPNGPlayer } = require('./apng/index')
const capture = require('./capture/index')

document.documentElement.style.fontSize = '100px'

const getConfigData = e => config[e.category][e.item_id]

const parseSrc = url => url.split('static/')[1]

const creatDomImg = item => {
    if (item.category == 'eye') {
        return new Promise((resolve, reject) => {
            loadAPNGPlayer(parseSrc(item.src)).then(player => {
                let url = player.drawEye()
                const img = document.createElement('img')
                img.style.position = 'absolute'
                Object.keys(item.style).forEach(e => {
                    img.style[e] = item.style[e]
                })
                img.onload = () => {
                    resolve(img)
                }
                img.src = url
            })
        })
    }
    return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.style.position = 'absolute'
        Object.keys(item.style).forEach(e => {
            img.style[e] = item.style[e]
        })
        img.onload = () => {
            resolve(img)
        }
        img.src = parseSrc(item.src)
    })
}

const creatAvatarUrl = data =>
    new Promise(async(resolve, reject) => {
        let box = document.querySelector('.scene-box')
        let scene = document.querySelector('.save-scene')
        let promises = data.map(item => creatDomImg(item))
        try {
            let domList = await Promise.all(promises)
            for (let i = 0; i < domList.length; i++) {
                const e = domList[i]
                box.appendChild(e)
            }
            let canvas = await capture.toCanvas(scene, { resolution: 3 })
            let base64 = await capture.getPNGImage(canvas)
            box.innerHTML = ''
            resolve(base64)
        } catch (error) {
            JSB.UI.toast('处理失败,请重新尝试')
            console.log(error)
        }
    })

function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return u8arr
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/data', (req, res) => {
    if (req.body && req.body.play_data && req.body.play_data.length) {
        let arr = req.body.play_data
        let clothes = arr.map(e => getConfigData(e))
        creatAvatarUrl(clothes).then(base64 => {
            let file = dataURLtoFile(base64, '')
            res.send(Buffer.from(file).toString('base64'))
        })
    }
})
app.listen(9001, () => {
    console.log('Example app listening on port 9001!')
})
