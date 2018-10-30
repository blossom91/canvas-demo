const e = name => document.querySelector(name)

// const add
const bindEvent = (e, eventName, callback) => e.addEventListener(eventName, callback)

// 简单的检测碰撞函数
const isCrash = (rect1, rect2) =>
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
