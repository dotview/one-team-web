<template>
    <div class="report-content"
        @mouseover="changeHandle(true)"
        @mouseout="changeHandle(false)">
        <div class="hd">
            <router-link :to="{name: 'personalCenter', params: {userId: reportData.userId}}">
                <avator :src="reportData.head" width="50px" :placeholder="reportData.name" />
                <!-- <img :src="reportData.head" alt=""> -->
            </router-link>
        </div>
            <div class="bd">
                <p class="bd-title">
                    <span v-if="reportData.name" class="name">{{reportData.name}}</span>
                    <span v-if="reportData.team" class="team">{{reportData.team}}</span>
                    <span v-if="reportData.createDate" class="date">{{reportData.createDate}}</span>
                    <span v-if="reportData.updateDate" class="date">{{reportData.updateDate}}</span>
                </p>
                <vue-markdown
                  v-highlight
                  :source="reportData.content"
                  :anchor-attributes="anchorAttributes"
                  class="markdown-body">
                </vue-markdown>
                <div class="answer-item"
                    v-if="!!reportData.reportId">
                    <div @click="answer"
                        class="answerTag handle">
                        <img src="../../../assets/icon/comment.png" alt="">
                        <span v-if="isShow">收起</span>
                        <span v-else>
                    <span v-if="answerLength > 0">{{answerLength}}条</span>
                        </span>评论
                    </div>
                    <div v-show="isHost && isHandling">
                        <span @click="reportEdit" class="handle">编辑</span>
                        <span @click="reportDelete" class="ml201 handle">删除</span>
                    </div>
                </div>
                <report-answer v-if="isShow"
                    :reportId="reportData.reportId"
                    @answerChange="answerChange"></report-answer>
            </div>
        </div>
</template>
<script>
import {
    API_REPORT
} from '@/api'
import VueMarkdown from 'vue-markdown'
import reportAnswer from './footer'
// import xss from 'assets/js/xss'
import avator from 'components/avator'

export default {
    name: 'reportEntry',
    props: {
        reportData: {
            type: Object
        },
        isHost: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isHandling: false,
            answerLength: 0,
            isShow: false,
            anchorAttributes: {
                target: '_blank'
            }
        }
    },
    components: {
        VueMarkdown,
        reportAnswer,
        avator
    },
    mounted() {
        this.answerLength = this.reportData.answerListLength
    },
    watch: {
        reportData(val) {
            this.isShow = false
            this.answerLength = val.answerListLength
        }
    },
    methods: {
        changeHandle(state) {
            this.isHandling = state
        },
        reportDelete() {
            this.$confirm('确定删除这篇汇报吗?', '陛下', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.deleteIt()
            })
        },
        deleteIt() {
            this.$_delete(API_REPORT, {
                reportId: this.reportData.reportId
            }).then((res) => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                this.$emit('reportDelete')
            }).catch(error => {
                console.log(error.error)
            })
        },
        reportEdit() {
            this.$emit('reportEdit')
        },
        answerChange(answerLength) {
            this.answerLength = answerLength
        },
        answer() {
            this.isShow = !this.isShow
        }
    }
}
</script>
<style lang="scss" scoped>
.report-content {
    display: flex;
    justify-content: space-between;
}

.hd {
    img {
        border-radius: 50%;
        width: 50px;
        height: 50px;
    }
}

.bd {
    margin-left: 10px;
    margin-bottom: 40px;
    flex-grow: 1;
}

.bd-title {
    font-size: 16px;
    margin-bottom: 10px;

    .name {
        color: #808080;
        font-size: 16px;
    }

    .date {
        font-size: 12px;
        color: #999;
    }
}

.answer-item {
    font-size: 14px;
    color: #666;
    line-height: 30px;
    vertical-align: middle;
    margin-top: 10px;
    display: flex;
    align-items: center;

    img {
        margin-right: 5px;
        width: 17px;
    }

    .answerTag {
        display: flex;
        align-items: center;
        margin-right: 20px;
    }
}

.handle {
    cursor: pointer;
}

.ml201 {
    margin-left: 20px;
}
</style>
