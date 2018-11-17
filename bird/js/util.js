const random = (start, end) => {
    const num = Math.random() * (end - start + 1)
    return Math.floor(num + start)
}

const isCrash = (rect1, rect2) =>
    rect1.x <= -5 + rect2.x + rect2.w &&
    -5 + rect1.x + rect1.w >= rect2.x &&
    rect1.y <= -5 + rect2.y + rect2.h &&
    -5 + rect1.h + rect1.y >= rect2.y

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
