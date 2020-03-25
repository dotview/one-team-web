<template>
    <div class="forum-add">
        <div class="forum-add_header">
            <date-range type="week" :disabled="true" />
            <el-button class="header-btn" @click="backList">返回列表</el-button>
        </div>
        <forum-editor :content="content" :user-info="userInfo" @submit="submit"/>
    </div>
</template>
<script>
import {
    getFirstDayOfWeek,
    getLastDayOfWeek
} from '@/assets/util/day'
import dateRange from 'components/daterange'
import forumEditor from './common/forumeditor'
import {
    API_FORUM_DETAIL
} from '@/api'
import { mapState } from 'vuex'

export default {
    name: 'forumEdit',
    data() {
        return {
            content: '',
            curContent: '',
            forumId: this.$route.query.forumId,
            beginDate: '',
            endDate: ''
        }
    },
    components: {
        dateRange,
        forumEditor
    },
    computed: {
        ...mapState({
            userInfo: 'userInfo'
        })
    },
    watch: {
        '$route': {
            handler: 'init',
            deep: true,
            immediate: true
        }
    },
    methods: {
        init() {
            this.beginDate = this.$route.query.beginDate || getFirstDayOfWeek()
            this.endDate = this.$route.query.endDate || getLastDayOfWeek()
            if (this.forumId) {
                this.initData()
            }
        },
        initData() {
            this.$_get(API_FORUM_DETAIL, {
                beginDate: this.beginDate,
                endDate: this.endDate,
                forumId: this.forumId
            }).then((res) => {
                this.content = res.owner ? res.owner.content : ''
            })
        },
        backList() {
            this.$router.push({
                name: 'forumList',
                query: {
                    beginDate: this.beginDate,
                    endDate: this.endDate
                }
            })
        },
        async submit(content) {
            this.curContent = content
            if (this.forumId) {
                await this.update()
            } else {
                await this.save()
            }
            this.$router.push({
                name: 'forumDetail',
                query: {
                    beginDate: this.beginDate,
                    endDate: this.endDate
                },
                params: {
                    forumId: this.forumId
                }
            })
        },
        save() {
            let params = {
                userId: this.userInfo._id,
                content: this.curContent,
                beginDate: this.beginDate
            }
            return this.$_post(API_FORUM_DETAIL, params).then((res) => {
                this.forumId = res.forumId
                this.$message({
                    message: '发布成功！',
                    type: 'success'
                })
            })
        },
        update() {
            let params = {
                forumId: this.forumId,
                content: this.curContent
            }
            return this.$_put(API_FORUM_DETAIL, params).then((res) => {
                this.$message({
                    message: '发布成功！',
                    type: 'success'
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.forum-add {
    width: 100%;
    &_header {
        position: relative;
        margin-bottom: 40px;
    }
}
.header-btn {
    position: absolute;
    right: 20px;
    top: 15px;
}
</style>
