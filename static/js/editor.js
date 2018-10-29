// 关卡编辑入口

class Editor {
    constructor(scene) {
        this.scene = scene
        this.level = null
        this.life = null
        this.backArr = []
        this.changeEditorLevel()
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
    }
    startEditor() {
        console.log('开始编辑模式')
        const contain = e('.editor-contain')
        contain.style.display = 'block'
        // 先备份一份数据
        this.backArr = JSON.parse(JSON.stringify(blocks))
        this.scene.changeLevel(this.level)
        this.scene.isEditor = true
    }
    changeEditorLevel() {
        const level = e('.editor-input')
        this.level = level.value
        if (blocks[this.level - 1] == void 0) {
            blocks[this.level - 1] = []
        }
        bindEvent(level, 'input', event => {
            this.level = event.target.value
            if (blocks[this.level - 1] == void 0) {
                blocks[this.level - 1] = []
            }
            this.scene.changeLevel(this.level)
            console.log('changeEditorLevel', this.level)
        })
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
        const canvas = e('#game')
        bindEvent(canvas, 'mousedown', event => {
            if (!this.scene.isEditor) return
            const x = event.offsetX * 1.5
            const y = event.offsetY * 1.5
            blocks[this.level - 1].push({
                x,
                y,
                life: parseInt(this.life),
            })
            console.log('now', blocks[this.level - 1])
            console.log('this.back', this.backArr)
        })
    }
    editorEnd() {
        console.log('编辑结束')
        const contain = e('.editor-contain')
        contain.style.display = 'none'
        this.scene.isEditor = false
        this.scene.changeLevel(1)
    }
    editorCancel() {
        blocks = this.backArr
        this.editorEnd()
    }
}
