// 关卡编辑入口

class Editor {
    constructor(scene) {
        this.scene = scene
        this.level = null
        this.life = null
        this.backArr = []
        this.updateLevel = []
        this.block = this.scene.imgByName('block')
        this.changeEditorLife()
        this.addBlocks()
        const editorBtn = e('#editor-btn')
        bindEvent(editorBtn, 'click', event => {
            this.startEditor()
            console.log('this.back', this.backArr)
        })
        const cancel = e('.btn-cancel')
        bindEvent(cancel, 'click', event => {
            this.editorCancel()
        })
        const complete = e('.btn-complete')
        bindEvent(complete, 'click', event => {
            this.editorEnd()
        })
        const level = e('.editor-input')
        bindEvent(level, 'input', event => {
            this.level = event.target.value
            if (blocks[this.level - 1] == void 0) {
                blocks[this.level - 1] = []
            }
            this.scene.changeLevel(this.level)
        })
    }
    startEditor() {
        console.log('开始编辑模式')
        const contain = e('.editor-contain')
        contain.style.display = 'block'
        // 先备份一份数据
        this.backArr = JSON.parse(JSON.stringify(blocks))
        const level = e('.editor-input')
        this.level = level.value
        if (blocks[this.level - 1] == void 0) {
            blocks[this.level - 1] = []
            console.log('blocks', blocks)
        }
        this.scene.changeLevel(this.level)
        this.scene.isEditor = true
    }

    changeEditorLife() {
        const life = e('#life-select')
        this.life = life.value
        bindEvent(life, 'input', event => {
            this.life = event.target.value
            console.log('changeEditorLife', this.life)
        })
    }
    addBlocks() {
        console.log(this.block)
        const canvas = e('#game')
        bindEvent(canvas, 'mousedown', event => {
            if (!this.scene.isEditor) return
            const x = event.offsetX * 1.5
            const y = event.offsetY * 1.5
            // 这个push应该要去重  这个去重暂时有bug 先这样吧
            let isPush = true
            blocks[this.level - 1].forEach(e => {
                let x1 = e.x
                let y1 = e.y
                let x2 = e.x + this.block.w
                let y2 = e.y + this.block.h
                let x3 = x + this.block.w
                let y3 = y + this.block.h
                if ((x >= x1 && x <= x2 && y >= y1 && y <= y2) || (e.x >= x && e.x <= x3 && e.y >= y && e.y <= y3)) {
                    console.log('砖块重叠了,不能添加')
                    isPush = false
                }
            })
            if (isPush) {
                blocks[this.level - 1].push({
                    x,
                    y,
                    life: parseInt(this.life),
                })
                if (!this.updateLevel.includes(this.level)) {
                    this.updateLevel.push(this.level)
                }
            }
        })
    }
    editorEnd(bool = true) {
        console.log('编辑结束')
        const contain = e('.editor-contain')
        contain.style.display = 'none'
        // 有新的关卡更改关卡文本
        if (bool) {
            let text = e('.level')
            this.updateLevel.forEach((e, index) => {
                if (text.innerText.includes(e)) {
                    this.updateLevel.splice(index, 1)
                }
            })
            text.innerText = text.innerText + this.updateLevel.sort().join('')
        }
        this.updateLevel = []
        this.scene.isEditor = false
        this.scene.changeLevel(1)
    }
    editorCancel() {
        blocks = this.backArr
        this.editorEnd(false)
    }
}
