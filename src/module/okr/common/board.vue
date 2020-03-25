<template>
    <div class="okr-board">
        <div class="okr-board_header" :style="{ backgroundColor: $store.state.color || '#409EFF' }">
            <div class="board-title">
                <rename
                  :disabled="!$store.state.okrPermission"
                  :title="board.title"
                  @confirm="renameBoardTitle"
                />
            </div>
            <div class="board-operate" v-if="$store.state.okrPermission">
                <el-popover
                  placement="bottom"
                  v-model="popoverVisible"
                  trigger="click">
                    <p style="margin-bottom: 15px;">确定要删除该列表吗？</p>
                    <div style="text-align: right; margin: 0;">
                        <el-button size="mini" type="text" :style="{ color: $store.state.color }" @click="popoverVisible = false">取消</el-button>
                        <el-button type="primary" size="mini" :style="{ backgroundColor: $store.state.color, borderColor: $store.state.color }" @click="deleteBoard">确定</el-button>
                    </div>
                    <i slot="reference" class="el-icon-delete delete-icon"></i>
                </el-popover>
            </div>
        </div>
        <div class="okr-board_body">
            <draggable v-model="board.cards" animation="500" :disabled="!$store.state.okrPermission">
                <div
                  v-for="(card, index) in board.cards"
                  :key="card.title"
                  class="board-card"
                  @click="openCard(card, index)">
                    <div>{{ card.title }}</div>
                    <div
                      class="badges"
                      v-if="card.targets.length"
                      :style="{
                        paddingLeft: targetsCount(card) === targetsDoneCount(card) && targetsDoneCount(card) !== 0 ? '4px' : '0',
                        paddingRight: targetsCount(card) === targetsDoneCount(card) && targetsDoneCount(card) !== 0 ? '4px' : '0',
                        backgroundColor: targetsCount(card) === targetsDoneCount(card) && targetsDoneCount(card) !== 0 ? $store.state.color : '',
                        color: targetsCount(card) === targetsDoneCount(card) && targetsDoneCount(card) !== 0 ? '#fff' : '#808080'
                      }">
                        <div class="fa" :style="{ borderColor: targetsCount(card) === targetsDoneCount(card) && targetsDoneCount(card) !== 0 ? '#fff' : '#808080'}"><i class="el-icon-check check-icon"></i></div>
                        <span>{{ targetsDoneCount(card) }}/{{ targetsCount(card) }}</span>
                    </div>
                </div>
            </draggable>
            <modify
              v-if="$store.state.okrPermission"
              add
              prefix-icon="plus"
              placeholder="添加卡片"
              type="textarea"
              @confirm="addCard"
            />
        </div>
    </div>
</template>

<script>
import { Popover } from 'element-ui'
import modify from './modify'
import rename from './rename'
import { mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
    name: 'okrCard',
    components: {
        'el-popover': Popover,
        modify,
        rename,
        draggable
    },
    props: {
        board: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            popoverVisible: false,
            add: false,
            newTitle: ''
        }
    },
    computed: {
        ...mapState({
            userInfo: 'userInfo'
        })
    },
    methods: {
        renameBoardTitle(value) {
            this.board.title = value
        },
        deleteBoard() {
            this.popoverVisible1 = false
            this.$emit('delete')
        },
        showPopover() {
            this.newTitle = this.board.title
            this.inputVisible = true
        },
        hidePopover() {
            this.inputVisible = false
        },
        openCard(card, index) {
            this.$emit('click', card, index)
        },
        addCard(item) {
            item = item.replace(/^\s+|\s+$/g, '')
            if (item) {
                this.board.cards.push({
                    title: item,
                    describe: '',
                    targets: []
                })
            }
        },
        deleteCard() {},
        targetsCount(card) {
            let count = 0
            card.targets.map(data => {
                count += data.children.length
            })
            return count
        },
        targetsDoneCount(card) {
            let count = 0
            card.targets.map(data => {
                count += data.children.filter(item => item.checked).length
            })
            return count
        }
    }
}
</script>

<style lang="scss" scoped>
.okr-board {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background: #f0f0f0;
    break-inside: avoid;
    margin-bottom: 20px;
    min-height: 150px;
    &_header {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        border-radius: 4px 4px 0 0;
    }
    &_body {
        font-size: 14px;
        padding: 10px 8px;
    }
}
.board-card {
    padding: 5px 15px 8px 15px;
    border-radius: 2px;
    cursor: pointer;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    margin-bottom: 10px;
    &:hover {
        background: #f7f7f7;
    }
    .badges {
        font-size: .8em;
        margin-top: 4px;
        padding: 2px 0;
        display: inline-flex;
        align-items: center;
        border-radius: 3px;
    }
    .fa {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-width: 1px;
        border-style: solid;
        border-radius: 2px;
        position: relative;
        margin-right: 5px;
        .check-icon {
            position: absolute;
            font-weight: 700;
            top: -1px;
            right: -2px;
        }
    }
}
.delete-icon {
    font-size: 16px;
    cursor: pointer;
    &:hover {
        font-weight: 700;
    }
}
.hover-icon {
    display: none;
}
.handle-item {
    color: #24292e;
    display: block;
    overflow: hidden;
    padding: 4px 10px 4px 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    width: 100%;
    cursor: pointer;
    &:hover {
        background: #f7f7f7;
    }
}
</style>
