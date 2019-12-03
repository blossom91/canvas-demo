const { APNGPlayer } = require('./player')
const { parse } = require('./parser')
const { load } = require('./load')

let customLoader = null
let customParser = null
let apngImageSupported = false

const loadAPNG = url => {
    let loader = customLoader || load
    return loader(url, load)
}
const parseAPNG = data => {
    let parser = customParser || parse
    return parser(data, parse)
}

exports.loadAPNGPlayer = src =>
    loadAPNG(src)
        .then(parseAPNG)
        .then(data => {
            if (data && data.createImages) {
                return data.createImages().then(() => data)
            } else {
                return Promise.reject('动画数据加载失败')
            }
        })
        .then(data => new APNGPlayer(data))
