/**
 * 一个利用canvas的apng播放器
 */
class APNGPlayer {
    constructor(data) {
        this.data = data
        this.dom = document.createElement('canvas')
        this.dom.width = data.width
        this.dom.height = data.height
        this.context = this.dom.getContext('2d')

        this.duration = 0
        this.data.frames.forEach(frame => {
            this.duration += frame.delay
        })
        this.loop = false
        this.progress = 0
        this.current = 0
        this.drawing = -1
        this.playedFrameTime = 0
        this.prevFrameData = null
        this.playingWithRAF = false
    }

    /**
     * 一个简单的用于独立播放的方法
     */
    playWithRAF(useReset) {
        if (this.playingWithRAF) {
            return
        }
        this.current = 0
        this.progress = 0
        this.drawing = -1
        this.playedFrameTime = 0
        this.playingWithRAF = true

        let lastTime = Date.now()
        let frame = () => {
            requestAnimationFrame(frame)
            let now = Date.now()
            if (useReset) {
                this.update(now - lastTime, true)
            } else {
                this.advance(now - lastTime)
                lastTime = now
            }
        }
        requestAnimationFrame(frame)
    }

    stop() {
        this.playingWithRAF = false
    }

    /**
     * 前进一段时间
     * @param {number} delta
     */
    advance(delta) {
        this.update(this.progress + delta)
    }

    /**
     * 更新到指定时间点
     * @param {number} time
     * @param {boolean} reset 如果这个为true会以遍历的方式计算，要更新到指定时间点，这个方法用于突然跳到某个时间点，而不是累计的方式
     */
    update(time, reset) {
        if (time > this.duration) {
            if (this.loop) {
                reset = true
            }
            time = time % this.duration
        }

        this.progress = time

        let frames = this.data.frames
        let frame

        if (reset) {
            this.playedFrameTime = 0
            let idx = 0
            while (this.progress > this.playedFrameTime && idx < frames.length) {
                frame = frames[idx]
                this.playedFrameTime += frame.delay
                this.current = idx
                idx++
            }
        } else {
            if (this.current >= frames.length) {
                return true
            }
            frame = frames[this.current]
            while (this.progress - this.playedFrameTime >= frame.delay) {
                this.current++
                this.playedFrameTime += frame.delay
                if (this.current >= frames.length) {
                    return true
                }
                frame = frames[this.current]
            }
        }

        if (!frame) {
            return
        }

        if (this.drawing != this.current) {
            this.drawing = this.current
            if (this.current > 0) {
                let lastFrame = frames[this.current - 1]
                if (lastFrame.disposeOp == 1) {
                    this.context.clearRect(lastFrame.left, lastFrame.top, lastFrame.width, lastFrame.height)
                } else if (lastFrame.disposeOp == 2) {
                    this.context.clearRect(lastFrame.left, lastFrame.top, lastFrame.width, lastFrame.height)
                }
            }
            if (frame.disposeOp == 2) {
            }
            if (frame.blendOp == 0) {
                this.context.clearRect(frame.left, frame.top, frame.width, frame.height)
            }
            this.context.drawImage(frame.imageElement, frame.left, frame.top)
        }
    }
    drawEye() {
        let drawFrame = this.data.frames[0]
        this.context.clearRect(0, 0, this.dom.width, this.dom.height)
        this.context.drawImage(drawFrame.imageElement, drawFrame.left, drawFrame.top)
        let url = this.dom.toDataURL('image/png')
        return url
    }
}
exports.APNGPlayer = APNGPlayer
