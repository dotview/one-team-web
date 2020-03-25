<template>
    <div class="modify">
        <div :class="[hover === 'weight' ? 'modify-box_weight' : 'modify-box_light']" :style="{cursor: disabled ? 'init' : 'pointer'}" @click="handler" v-if="!modify">
            <div v-if="!content" class="modify-placeholder" @click="handler1">
                <i v-if="prefixIcon" :class="`el-icon-${prefixIcon} prefix-icon`"></i>
                <span>{{ placeholder }}</span>
            </div>
            <span v-else class="modify-name" :style="{ fontSize: `${size}px`, color }">{{ name }}</span>
        </div>
        <div class="modify-input" v-else>
            <el-input
              v-if="type === 'textarea'"
              v-model="content"
              v-focus-textarea
              type="textarea"
              style="margin-bottom: 15px;"
              :autosize="{ minRows: 3, maxRows: 5 }"
              @keydown.native.prevent.13="confirm"
              @blur="cancel">
            </el-input>
            <el-input
              v-else
              v-model="content"
              v-focus-input
              size="medium"
              style="margin-bottom: 15px;"
              @keydown.native.prevent.13="confirm"
              @blur="cancel">
            </el-input>
            <div class="modify-input_footer">
                <el-button type="primary" size="medium" :style="{ backgroundColor: $store.state.color, borderColor: $store.state.color }" @mousedown.native.prevent="() => false" @mouseup.native.prevent="confirm">保存</el-button>
                <i class="el-icon-close close-icon" @mousedown.prevent="() => false" @mouseup="cancel"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'modify',
    props: {
        placeholder: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'input'
        },
        name: {
            type: String,
            default: ''
        },
        hover: {
            type: String,
            default: 'weight'
        },
        add: {
            type: Boolean,
            default: false
        },
        size: {
            type: [String, Number],
            default: 14
        },
        prefixIcon: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            modify: false,
            content: this.name,
            isClickBtn: false
        }
    },
    methods: {
        handler() {
            if (this.disabled) {
                return
            }
            this.$emit('activate', this.modify)
            this.modify = true
            this.isClickBtn = false
        },
        handler1() {
            if (this.disabled) {
                return
            }
            this.modify = true
        },
        confirm() {
            this.$emit('confirm', this.content)
            if (this.add) {
                this.content = ''
                this.modify = true
            } else {
                this.modify = false
                this.isClickBtn = true
            }
        },
        cancel() {
            if (!this.isClickBtn) {
                this.$emit('cancel', this.modify)
                this.modify = false
                this.content = this.name
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.modify {
    width: 100%;
    &-input {
        padding: 6px;
    }
    &-placeholder {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: rgb(140, 140, 140);
        .prefix-icon {
            margin-right: 5px;
        }
    }
    &-box_weight {
        padding: 6px;
        border-radius: 2px;
        cursor: pointer;
        &:hover {
            background: #fff;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
    }
    &-box_light {
        padding: 6px;
        border-radius: 2px;
        &:hover {
            .prefix-icon {
                font-weight: 700;
            }
        }
    }
}
.close-icon {
    color: #8c8c8c;
    font-size: 22px;
    vertical-align: middle;
    cursor: pointer;
    &:hover {
        font-weight: 700;
    }
}
/deep/ .el-textarea__inner:focus, /deep/ .el-input__inner:focus {
    border-color: #C0C4CC;
}
</style>
