<template>
    <div class="okr-detail" v-if="loading">
        <div class="okr-detail_header" :style="{ borderColor: $store.state.color }">
            <div class="okr-detail_title" :style="{ color: $store.state.color || '#409EFF' }">
                <i class="el-icon-back okr-detail_back" :style="{ color: $store.state.color }" @click="back"> 返回看板</i>
                <div class="divider" :style="{ backgroundColor: $store.state.color }"></div>
                <span class="title">{{ detail.title }}</span>
                <i class="el-icon-edit title-icon" @click="dialogVisible = true" v-if="isCreater"></i>
            </div>
            <el-color-picker
              v-model="$store.state.color"
              :predefine="predefineColors"
              :disabled="!isCreater"
              @change="themeChange">
            </el-color-picker>
        </div>
        <transition name="nav-forum-animate">
            <div :class="['okr-detail_nav']">
                <i class="nav-title el-icon-user-solid"> 成员</i>
                <div class="nav-content">
                    <a
                      href="javascript:void(0);"
                      v-for="item in detail.member"
                      :title="item.nickName"
                      :key="item._id"
                      class="nav-item">
                        <avator :src="item.headPortrait" width="32px" radius="5px" size="12px" :background="$store.state.color" :placeholder="item.nickName" />
                        <i class="el-icon-remove nav-icon" v-if="isCreater && item._id !== detail.creater._id" @click="removeMember(item._id)"></i>
                    </a>
                    <el-popover
                      placement="bottom"
                      width="320"
                      v-model="popoverVisible"
                      trigger="click">
                        <el-select v-model="newMember" filterable multiple placeholder="请选择成员">
                            <el-option
                              v-for="item in teamInfo"
                              :key="item._id"
                              :label="item.nickName"
                              :value="item._id">
                            </el-option>
                        </el-select>
                        <div style="text-align: right; margin-top: 15px;">
                            <el-button size="mini" type="text" :style="{ color: $store.state.color }" @click="popoverVisible = false">取消</el-button>
                            <el-button type="primary" size="mini" :style="{ backgroundColor: $store.state.color, borderColor: $store.state.color }" @click="addMember">确定</el-button>
                        </div>
                        <a slot="reference" href="javascript:void(0);" class="nav-plus" v-if="isCreater && detail.member.length !== teamInfo.length">
                            <i class="el-icon-plus" style="font-weight: 700;"></i>
                        </a>
                    </el-popover>
                </div>
            </div>
        </transition>
        <div class="okr-detail_body">
            <okr-board
              class="column"
              v-for="(item, index) in detail.boards"
              :key="index"
              :board="item"
              @delete="() => deleteBoard(index)"
              @click="(card, cardIndex) => openDrawer(card, cardIndex, index)"
            />
            <div class="list-new" v-if="$store.state.okrPermission">
                <modify
                  add
                  prefix-icon="plus"
                  placeholder="添加列表"
                  hover="light"
                  @confirm="addBoard"
                />
            </div>
        </div>
        <el-dialog
          :visible.sync="dialogVisible"
          title="重命名看板"
          width="30%"
          @open="openDialog">
            <div class="input-wrapper"><div class="input-title">标题：</div><el-input v-model="newTitle" placeholder="请输入标题"></el-input></div>
            <div class="input-wrapper"><div class="input-title">描述：</div><el-input v-model="newDescribe" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描述"></el-input></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelRename">取 消</el-button>
                <el-button type="primary" @click="confirmRename">重命名</el-button>
            </span>
        </el-dialog>
        <el-drawer
          :before-close="handleDrawerClose"
          :visible.sync="drawer"
          direction="rtl"
          destroy-on-close
          size="35%"
          ref="drawer">
            <div class="drawer-title" slot="title">
                <rename
                  size="19"
                  :title="card.title"
                  :disabled="!$store.state.okrPermission"
                  @confirm="renameCardTitle"
                />
                <el-popover
                  v-model="drawerTitlePopoverVisible"
                  v-if="$store.state.okrPermission"
                  placement="bottom"
                  trigger="click">
                    <ul>
                        <li class="operation-item" @click="deleteCard">删除该卡片</li>
                    </ul>
                    <i class="el-icon-s-operation" style="cursor: pointer;" slot="reference"></i>
                </el-popover>
            </div>
            <div class="drawer-content">
                <div class="drawer-content_part">
                    <div class="part-title">描述</div>
                    <modify
                      size="16"
                      placeholder="添加描述"
                      type="textarea"
                      hover="light"
                      :disabled="!$store.state.okrPermission"
                      :name="card.describe"
                      @confirm="addDescribe"
                    />
                </div>
                <div class="drawer-content_part">
                    <div class="part-title">清单</div>
                    <div class="drawer-content_item" v-for="(target, index1) in card.targets" :key="target.label">
                        <div class="item-header">
                            <div class="item-title">
                                <modify
                                  size="19"
                                  hover="light"
                                  :name="target.label"
                                  :disabled="!$store.state.okrPermission"
                                  @activate="ctrls[index1].ctrlVisible = false"
                                  @confirm="(item) => modifyTarget(item, index1)"
                                  @cancel="ctrls[index1].ctrlVisible = true"
                                />
                            </div>
                            <div class="item-operate" v-if="ctrls[index1].ctrlVisible">
                                <span :style="{ color: target.children.filter(data => data.checked).length === target.children.length && target.children.length !== 0 ? $store.state.color : 'inherit'}">{{ target.children.filter(data => data.checked).length }}/{{ target.children.length }}</span>
                                <el-popover
                                  v-model="ctrls[index1].popoverVisible"
                                  v-if="$store.state.okrPermission"
                                  placement="bottom-end"
                                  trigger="click">
                                    <p style="margin-bottom: 15px;">确定要删除该清单吗？</p>
                                    <div style="text-align: right; margin: 0;">
                                        <el-button size="mini" type="text" :style="{ color: $store.state.color }" @click="ctrls[index1].popoverVisible = false">取消</el-button>
                                        <el-button type="primary" size="mini" :style="{ backgroundColor: $store.state.color, borderColor: $store.state.color }" @click="deleteTarget(index1)">确定</el-button>
                                    </div>
                                    <span class="item-delete" slot="reference">删除...</span>
                                </el-popover>
                            </div>
                        </div>
                        <div class="item-subs">
                            <draggable v-model="target.children" animation="500" :disabled="!$store.state.okrPermission">
                                <div class="item-sub" v-for="(subTarget, index2) in target.children" :key="subTarget.label">
                                    <div
                                      v-show="ctrls[index1].sub[index2].ctrlVisible"
                                      :class="['materialCheckBox', {'is-checked': subTarget.checked}]"
                                      :style="{ borderColor: subTarget.checked ? $store.state.color : '#5a5a5a', cursor: !$store.state.okrPermission ? 'init' : 'pointer' }"
                                      @click="toggleCheckbox(subTarget)">
                                    </div>
                                    <div style="width: calc(100% - 55px)">
                                        <modify
                                          size="16"
                                          hover="light"
                                          :color="subTarget.checked ? $store.state.color : ''"
                                          :name="subTarget.label"
                                          :disabled="!$store.state.okrPermission"
                                          @activate="ctrls[index1].sub[index2].ctrlVisible = false"
                                          @confirm="(item) => modifySubTarget(item, index1, index2)"
                                          @cancel="ctrls[index1].sub[index2].ctrlVisible = true"
                                        />
                                    </div>
                                    <div v-show="ctrls[index1].sub[index2].ctrlVisible && $store.state.okrPermission" class="item-sub_delete" @click="deleteSubTarget(index1, index2)">删除...</div>
                                </div>
                            </draggable>
                            <modify
                              v-if="$store.state.okrPermission"
                              add
                              prefix-icon="plus"
                              placeholder="扩充清单..."
                              hover="light"
                              @confirm="(item) => addSubTarget(item, index1)"
                            />
                        </div>
                    </div>
                    <modify
                      v-if="$store.state.okrPermission"
                      add
                      prefix-icon="plus"
                      placeholder="添加待办清单..."
                      hover="light"
                      @confirm="addTarget"
                    />
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { ColorPicker, Drawer, Popover, Select, Option } from 'element-ui'
import board from './common/board'
import modify from './common/modify'
import rename from './common/rename'
import draggable from 'vuedraggable'
import avator from 'components/avator'
import { mapState } from 'vuex'
import {
    API_OKRS,
    API_OKRS_DETAIL
} from '@/api'

export default {
    name: 'okrDetail',
    components: {
        'el-color-picker': ColorPicker,
        'el-drawer': Drawer,
        'el-popover': Popover,
        'el-select': Select,
        'el-option': Option,
        'okr-board': board,
        modify,
        rename,
        draggable,
        avator
    },
    data() {
        return {
            loading: false,
            okrId: this.$route.params.id,
            newTitle: '',
            newDescribe: '',
            detail: {
                boards: [],
                creater: {},
                describe: '',
                title: '',
                state: '',
                member: []
            },
            ctrls: [],
            predefineColors: [
                '#409EFF',
                '#27ae60',
                '#E6A23C',
                '#F56C6C',
                '#8e44ad',
                '#2c3e50'
            ],
            drawerTitlePopoverVisible: false,
            dialogVisible: false,
            inputVisible: false,
            popoverVisible: false,
            drawer: false,
            card: {
                title: '',
                describe: '',
                tagets: []
            },
            newMember: []
        }
    },
    computed: {
        ...mapState({
            userInfo: 'userInfo',
            teamInfo: 'teamInfo'
        }),
        isCreater() {
            return this.detail.creater._id === this.userInfo._id
        }
    },
    watch: {
        'detail': {
            handler(val) {
                let permission = val.member.findIndex(data => data._id === this.userInfo._id) >= 0 || val.creater._id === this.userInfo._id
                this.$store.commit('SET_OKR_PERMISSION', permission)
            },
            immediate: true,
            deep: true
        },
        'card': {
            handler(val) {
                this.ctrls = []
                if (val.targets && val.targets.length) {
                    val.targets.forEach(data => {
                        let sub = []
                        data.children.forEach(item => {
                            sub.push({
                                ctrlVisible: true
                            })
                        })
                        this.ctrls.push({
                            ctrlVisible: true,
                            popoverVisible: false,
                            sub
                        })
                    })
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        this.getDetail()
        window.addEventListener('beforeunload', this.updateDetail, false)
    },
    beforeDestroy() {
        this.updateDetail()
    },
    destroyed() {
        window.removeEventListener('beforeunload', this.updateDetail, false)
    },
    methods: {
        getDetail() {
            let params = {
                okrId: this.okrId
            }
            this.$_get(API_OKRS_DETAIL, params, {loading: true}).then(res => {
                this.detail = res.detail
                this.$store.state.color = this.detail.theme || '#409EFF'
                this.$nextTick(() => {
                    this.loading = true
                })
            })
        },
        updateDetail() {
            this.$_put(API_OKRS, this.detail)
        },
        toggleCheckbox(subTarget) {
            if (!this.$store.state.okrPermission) {
                return
            }
            subTarget.checked = !subTarget.checked
        },
        openDialog() {
            this.newTitle = this.detail.title
            this.newDescribe = this.detail.describe
        },
        cancelRename() {
            this.dialogVisible = false
        },
        // 添加成员
        addMember() {
            let newMember = []
            newMember = this.newMember.map(item => {
                return this.teamInfo.filter(data => data._id === item)[0]
            })
            this.detail.member = this.detail.member.concat(newMember)
            this.popoverVisible = false
            this.newMember = []
        },
        // 移出成员
        removeMember(id) {
            let index = this.detail.member.findIndex(data => data._id === id)
            this.detail.member.splice(index, 1)
        },
        // 确认修改okr名称和描述
        confirmRename() {
            this.detail.title = this.newTitle
            this.detail.describe = this.newDescribe
            this.dialogVisible = false
        },
        // 更改主题
        themeChange(value) {
            this.detail.theme = value
        },
        // 添加看板
        addBoard(item) {
            item = item.replace(/^\s+|\s+$/g, '')
            if (item) {
                this.detail.boards.push({
                    creater: this.userInfo._id,
                    title: item,
                    cards: []
                })
            }
        },
        // 删除看板
        deleteBoard(index) {
            this.detail.boards.splice(index, 1)
        },
        // 打开抽屉
        openDrawer(card, cardIndex, boardIndex) {
            this.card = card
            this.cardIndex = cardIndex
            this.boardIndex = boardIndex
            this.drawer = true
        },
        // 关闭抽屉
        handleDrawerClose(done) {
            done()
        },
        // 删除卡片
        deleteCard() {
            this.drawerTitlePopoverVisible = false
            this.drawer = false
            this.detail.boards[this.boardIndex].cards.splice(this.cardIndex, 1)
        },
        // 确认修改卡片名称
        renameCardTitle(value) {
            this.card.title = value
        },
        // 确认添加/修改卡片描述
        addDescribe(item) {
            this.card.describe = item
        },
        // 添加一级目标
        addTarget(item) {
            item = item.replace(/^\s+|\s+$/g, '')
            if (item) {
                this.card.targets.push({
                    label: item,
                    children: []
                })
            }
        },
        // 修改一级目标
        modifyTarget(item, index) {
            this.card.targets[index].label = item
            this.ctrls[index].ctrlVisible = true
        },
        // 删除一级目标
        deleteTarget(index) {
            this.card.targets.splice(index, 1)
        },
        // 添加二级目标
        addSubTarget(item, index) {
            if (item) {
                this.card.targets[index].children.push({
                    label: item,
                    checked: false
                })
            }
        },
        // 修改二级目标
        modifySubTarget(item, index1, index2) {
            this.card.targets[index1].children[index2].label = item
            this.ctrls[index1].sub[index2].ctrlVisible = true
        },
        // 删除二级目标
        deleteSubTarget(index1, index2) {
            this.card.targets[index1].children.splice(index2, 1)
        },
        back() {
            this.$router.back()
        }
    }
}
</script>

<style lang="scss" scoped>
.okr-detail {
    position: relative;
    &_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }
    &_body {
        width: 100%;
        column-count: 3;
        column-width: 33%;
        column-gap: 20px;
    }
    &_title {
        display: flex;
        align-items: center;
    }
    .divider {
        width: 1px;
        height: 16px;
        margin: 0 18px;
    }
    &_back {
        cursor: pointer;
        font-weight: 700;
    }
}
.title {
    font-size: 20px;
    font-weight: 700;
    &-icon {
        margin: 0 5px;
        font-size: 15px;
        cursor: pointer;
        user-select: none;
        &:hover {
            font-weight: 700;
        }
    }
}
.input-wrapper {
    display: flex;
    margin-bottom: 20px;
}
.input-title {
    width: 50px;
}
.list-new {
    border-radius: 4px;
    background: #dedede;
    height: 150px;
    color: #8c8c8c;
    padding: 16px 14px;
    font-size: 14px;
    max-width: 300px;
    margin-bottom: 20px;
    break-inside: avoid;
}
.okr-detail_nav {
    position: absolute;
    width: 131px;
    top: 59px;
    right: 0;
    transform: translateX(120%);
    background: #fff;
    padding: 10px;
    border-radius: 5px;
    .nav-title {
        display: block;
        margin-bottom: 12px;
        padding-bottom: 6px;
        font-size: 14px;
        color: #808080;
        font-weight: 600;
        border-bottom: 1px solid #e1e4e8;
    }
    .nav-content {
        display: flex;
        flex-wrap: wrap;
    }
    .nav-item {
        display: inline-block;
        vertical-align: text-top;
        position: relative;
        width: 32px;
        height: 32px;
        margin-right: 5px;
        margin-bottom: 5px;
        &:hover {
            .nav-icon {
                display: block;
            }
        }
    }
    .nav-name {
        display: inline-block;
        margin-right: 5px;
        margin-bottom: 5px;
        text-align: center;
        color: #fff;
        width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 5px;
    }
    .nav-icon {
        position: absolute;
        color: red;
        right: 0px;
        top: -4px;
        font-size: 12px;
        cursor: pointer;
        display: none;
    }
    .nav-plus {
        display: inline-block;
        vertical-align: text-top;
        width: 32px;
        height: 32px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #a6a6a6;
        border-radius: 5px;
        color: #a6a6a6;
        cursor: pointer;
        &:hover {
            color: #666;
            border-color: #666;
        }
    }
}
.drawer-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 10px;
}
.operation-item {
    cursor: pointer;
    padding: 6px;
    &:hover {
        background: #f7f7f7;
    }
}
.drawer-content {
    padding: 0 20px;
    &_part {
        padding-bottom: 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid #dbdbdb;
        .part-title {
            font-size: 17px;
            margin-bottom: 10px;
            color: #72767b;
            font-weight: 700;
        }
    }
    &_item {
        .item-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .item-title {
            font-weight: 700;
            padding-left: 25px;
            color: #4d4d4d;
            width: calc(100% - 68px);
        }
        .item-operate {
            color: #8c8c8c;
            font-size: 14px;
        }
        .item-delete {
            text-decoration: underline;
            cursor: pointer;
            &:hover {
                color: #4d4d4d;
            }
        }
        .item-subs {
            padding-left: 40px;
        }
        .item-sub {
            position: relative;
            display: flex;
            padding-left: 5px;
            margin: 5px 0;
            color: #4d4d4d;
            &_delete {
                display: none;
                width: 48px;
                position: absolute;
                right: -14px;
                top: 7px;
                color: #8c8c8c;
                font-size: 14px;
                text-decoration: underline;
                cursor: pointer;
                &:hover {
                    color: #4d4d4d;
                }
            }
            &:hover {
                .item-sub_delete {
                    display: block;
                }
            }
        }
    }
}
.materialCheckBox {
    position: relative;
    width: 16px;
    height: 16px;
    z-index: 0;
    border-width: 2px;
    border-style: solid;
    border-radius: 1px;
    transition: 0.2s;
    margin: 0;
    margin-right: 3px;
    margin-top: 9px;
    &.is-checked {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-right-width: 2px;
        border-right-style: solid;
        border-top: none!important;
        border-left: none!important;
        top: -2px;
        left: -2px;
        width: 10px;
        height: 18px;
        margin-right: 9px;
        transform: rotate(40deg);
        transform-origin: 100% 100%;
    }
}
/deep/ .el-drawer {
    overflow: auto;
}
</style>
