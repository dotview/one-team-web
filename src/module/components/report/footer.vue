<template>
    <div class="answer-box">
        <div v-for="(item, index) in answerList"
            class="answer-list"
            :key="index">
            <span class="answer-name">{{item.userId.nickName}}</span>
            :
            <span v-if="item.fUser" class="answer-name">@{{item.fUser.nickName}}</span>
            {{item.content}}
            <span v-if="item.userId._id === userId" class="handle-btn" @click="remove(item._id)">删除</span>
            <span v-else class="handle-btn" @click="answer(item)">{{answerBtnText(item._id)}}</span>
        </div>
        <div class="answer-content">
            <p class="answer-sub"
                v-if="!!answering.userName"><span>@{{answering.userName}}</span></p>
            <el-input v-model.trim="content"
                class="login-input"
                placeholder="我想说..."></el-input>
            <el-button type="primary"
                @click="submit"
                class="answer-btn">评论</el-button>
        </div>
    </div>
</template>
<script>
import {
    API_ANSWER
} from '@/api'
export default {
    name: 'reportFooter',
    props: {
        reportId: String,
        isHandling: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isInit: false,
            content: '',
            answerList: [],
            userId: '',
            answering: {
                fId: '',
                userId: '',
                userName: ''
            }
        }
    },
    filter: {
        answerBtnText(val) {
            return val === this.answering.fId ? '取消回复' : '回复'
        }
    },
    mounted() {
        if (!this.isInit) {
            this.init()
        }
    },
    methods: {
        init() {
            this.$_get(API_ANSWER, {
                reportId: this.reportId
            }).then((res) => {
                this.reset()
                this.answerList = res.list
                this.isInit = true
                this.userId = res.userId
                this.$emit('answerChange', res.list.length)
            }).catch(error => {
                console.log(error.error)
            })
        },
        submit() {
            if (!this.content) {
                return
            }
            this.$_post(API_ANSWER, {
                reportId: this.reportId,
                content: this.content,
                fId: this.answering.fId,
                fUser: this.answering.userId
            }).then((res) => {
                this.content = ''
                this.init()
            }).catch(error => {
                console.log(error.error)
            })
        },
        answer(item) {
            if (this.answering.fId === item._id) {
                this.reset()
                return
            }
            this.answering.fId = item._id
            this.answering.userId = item.userId._id
            this.answering.userName = item.userId.nickName
        },
        edit() {
            console.log('edit')
        },
        remove(id) {
            this.$confirm('确定删除这条评论吗?', '陛下', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.deleteIt(id)
            }).catch(() => {})
        },
        deleteIt(id) {
            this.$_delete(API_ANSWER, {
                answerId: id
            }).then((res) => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                this.init()
            }).catch(error => {
                console.log(error.error)
            })
        },
        answerBtnText(val) {
            return val === this.answering.fId ? '取消回复' : '回复'
        },
        reset() {
            this.answering.fId = ''
            this.answering.userId = ''
            this.answering.userName = ''
        }
    }
}
</script>
<style lang="scss" scoped>
.ft {
    margin-left: 55px;
    color: #222222;
}

.ml20 {
    margin-left: 20px;
}

.handle-btn {
    color: #999;
    cursor: pointer;
    margin-left: 30px;
}

.answer-box {
    font-size: 14px;
}

.answer-list {
    padding: 5px 0;
}

.answer-content {
    display: flex;
    align-items: center;
    margin-top: 5px;
}

.answer-btn {
    margin-left: 10px;
}

.answer-name {
    color: #409EFF;
}

.answer-sub {
    min-width: 60px;
    color: #666;
}
</style>
