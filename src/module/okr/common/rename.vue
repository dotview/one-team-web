<template>
    <div class="rename">
        <span class="rename-title" :style="{ fontSize: `${size}px` }">{{ oldTitle }}</span>
        <el-popover
          v-if="!disabled"
          placement="bottom"
          width="250"
          v-model="popoverVisible"
          trigger="click"
          @show="showPopover"
          @after-leave="hidePopover">
            <el-input
              v-if="inputVisible"
              v-model="newTitle"
              v-focus-input
              size="medium"
              style="margin-bottom: 15px;"
            />
            <div style="text-align: right; margin: 0;">
                <el-button size="mini" type="text" :style="{ color: $store.state.color }" @click="popoverVisible = false">取消</el-button>
                <el-button type="primary" size="mini" :style="{ backgroundColor: $store.state.color, borderColor: $store.state.color }" @click="confirmRename">重命名</el-button>
            </div>
            <i slot="reference" class="el-icon-edit rename-icon"></i>
        </el-popover>
    </div>
</template>

<script>
import { Popover } from 'element-ui'

export default {
    name: 'rename',
    props: {
        title: {
            type: String,
            default: ''
        },
        size: {
            type: [String, Number],
            default: 17
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        'el-popover': Popover
    },
    watch: {
        'title': {
            handler(newVal) {
                this.oldTitle = newVal
            },
            immediate: true
        }
    },
    data() {
        return {
            popoverVisible: false,
            inputVisible: false,
            oldTitle: '',
            newTitle: ''
        }
    },
    methods: {
        showPopover() {
            this.newTitle = this.oldTitle
            this.inputVisible = true
        },
        hidePopover() {
            this.inputVisible = false
        },
        confirmRename() {
            if (this.oldTitle !== this.newTitle) {
                this.$emit('confirm', this.newTitle)
            }
            this.popoverVisible = false
            this.oldTitle = this.newTitle
        }
    }
}
</script>

<style lang="scss" scoped>
.rename {
    &-title {
        font-weight: 700;
    }
    &-icon {
        font-size: 15px;
        cursor: pointer;
        &:hover {
            font-weight: 700;
        }
    }
}
/deep/ .el-textarea__inner:focus, /deep/ .el-input__inner:focus {
    border-color: #C0C4CC;
}
</style>
