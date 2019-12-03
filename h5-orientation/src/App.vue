<template>
    <div id="app">
        <div class="box" ref="box">
        </div>
    </div>
</template>

<script>
let Orientation = require('orientation.js')
export default {
    name: 'App',
    data() {
        return {
        }
    },
    mounted() {
        const width = document.body.scrollWidth
        const height = document.body.scrollHeight
        const self = this
        let ori = new Orientation({
            onChange: e => {
                let toRight = Math.floor(e.rightRotate)
                let right = Math.floor(e.rightSlant)
                let top = Math.floor(e.forwardSlant)
                if (Math.abs(right) <= 5 && Math.abs(top) <= 5 && Math.abs(toRight) <= 5) {
                    right = 0
                    top = 0
                } else {
                    if (top > 90) {
                        top = 90
                    } else if (top < -90) {
                        top = -90
                    }
                    right = right * 2 + toRight * 7
                    top = top * 2
                    if (right >= document.body.scrollLeft) {
                        right = document.body.scrollLeft
                    } else if (right <= -(width - document.body.scrollLeft)) {
                        right = width - document.body.scrollLeft
                    }
                    if (top >= document.body.scrollTop) {
                        top = document.body.scrollTop
                    } else if (top <= -(height - document.body.scrollTop)) {
                        top = height - document.body.scrollTop
                    }
                }
                if (requestAnimationFrame) {
                    requestAnimationFrame(() => {
                        self.$refs.box.style.transform = `translate(${right}px,${top}px)`
                    })
                } else {
                    self.$refs.box.style.transform = `translate(${right}px,${top}px)`
                }
            },
        })
        ori.init()
        window.scrollTo(300, 300)
    },

}
</script>

<style lang="less">
#app {
    width: 100%;
    height: 100%;
    .box {
        width: 12.8rem;
        height: 9.6rem;
        background-image: url(./0.jpeg);
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        transition: 0.1s linear;
    }
}
</style>


