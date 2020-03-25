<template>
    <transition name="el-zoom-in-top">
        <div class="cardbox"
            @click.stop
            v-show="isShow">
            <el-card class="box-card">
                <div slot="header"
                    class="clearfix">
                    <span>通知</span>
                    <el-button v-if="msgList.length"
                        @click="markRead()"
                        style="float: right; padding: 3px 0"
                        type="text">全部标记为已读</el-button>
                </div>
                <!-- <el-icon-loading /> -->
                <template v-if="msgList.length">
                    <!-- <p class="msg__caption">点击查看详情。</p> -->
                    <!-- <br> -->
                    <div class="msg__outter">
                        <div v-for="(item,index) in msgList"
                            :key="index"
                            @click="goDetail(item,index)"
                            class="msg__item">
                            <span class="text-blue">{{item.user?item.user.nickName:'xx' }}</span>
                            <span class="text-small text-secondary">回复：</span>
                            <p class="msg__content text-regular">{{item.content}}</p>
                            <!-- {{ item.type|dicTypes }}   -->
                            <!-- el-icon-check> -->
                            <i @click.stop="markRead(item.id,index)" class="el-icon-check" title="标记为已读"></i>
                        </div>
                    </div>
                </template>
                <div v-else
                    class="msg__caption">
                    冷冷清清 凄凄惨惨戚戚～～
                </div>
            </el-card>
        </div>
    </transition>
</template>
<script>
import {
    getFirstDayOfWeek,
    getLastDayOfWeek
} from '@/assets/util/day'
import { API_MSGBOX } from '@/api'
export default {

    name: 'carbox',
    props: {
        isShow: Boolean
    },
    filters: {
        dicTypes(value) {
            return ({
                COMMENT: '评论'
            })[value]
        }
    },
    data() {
        return {
            msgList: []
        }
    },
    watch: {
        isShow(to, from) {
            if (to && !this.msgList.length) {
                // if (to) {
                this.getMsgList()
            }
        }
    },
    mounted() {
        // console.log(11)
    },
    methods: {
        goDetail({ report = {}, id }, index) {
            let {
                beginDate,
                userId
            } = report
            if (!userId) {
                return
            }
            this.markRead(id, index).then(() => {
                this.$emit('close')
                this.$router.push({
                    name: 'personalCenter',
                    params: {
                        userId
                    },
                    query: {
                        beginDate: getFirstDayOfWeek(beginDate),
                        endDate: getLastDayOfWeek(beginDate)
                    }
                })
            })
        },
        markRead(id, index) {
            let type = id ? 'single' : 'all'
            return new Promise((resolve, reject) => {
                this.$_put(API_MSGBOX, { id }).then(res => {
                    if (type === 'single') {
                        this.msgList.splice(index, 1)
                    } else {
                        this.msgList = []
                    }
                    this.$emit('read', type)
                    resolve()
                })
            })
        },
        getMsgList() {
            this.$_get(API_MSGBOX).then(res => {
                this.msgList = res.list
            }).catch(error => {
                console.log(error.error)
            })
        }
    }
}
</script>
<style lang="scss"
    scoped>
.cardbox {
    line-height: 1;
    position: absolute;
    z-index: 9;
    width: 440px;
    right: -40px;

    &::before {
        content: '';
        display: block;
        position: absolute;
        z-index: 100;
        top: -10px;
        right: 62px;
        border: 10px solid transparent;
        border-bottom: 11px solid #fff;
        border-top: 0;
    }

    &::after {
        content: '';
        display: block;
        position: absolute;
        top: -11px;
        right: 61px;
        border: 11px solid transparent;
        border-bottom: 12px solid #e9eef6;
        border-top: 0;

    }
}

.msg__outter {
    max-height: 600px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.msg__caption {
    color: #909399;
    padding: 0 20px;
}

.msg__item {
    display: flex;
    align-items: flex-start;
    line-height: 20px;
    // margin-bottom: 10px;
    position: relative;
    padding: 10px 20px;
    color: #606266;
    // font-size: 14px;

    // border-bottom: 1px solid #f00;
    &:not(:last-child):after {
        position: absolute;
        bottom: 0;
        left: 20px;
        content: '';
        width: 100%;
        height: 1px;
        background-color: #F2F6FC;
    }

    &:hover {
        background-color: #F6F6F6;

        .el-icon-check {
            display: inline-block;
        }
    }

    .msg__content {
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        padding-right: 10px;
    }

    .el-icon-check {
        display: none;
        position: absolute;
        right: 10px;
        font-weight: bold;
        font-size: 24px;
        vertical-align: middle;
        // color: #409EFF;

        &:hover {
            color: #409EFF;
        }
    }
}

/deep/ .el-card__body {
    padding: 20px 0;
    // line-height: 1.2;
}

.text-blue {
    color: #409EFF;
}

.text-secondary {
    color: #909399;
}

.text-regular {
    color: #606266;
}

.text-small {
    font-size: 13px;
}
</style>
