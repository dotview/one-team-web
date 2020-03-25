<template>
    <div class="forum-detail">
        <div class="forum-detail_header">
            <date-range type="week" :disabled="true" />
            <el-button class="header-btn" @click="backList">返回列表</el-button>
        </div>
        <template v-if="owner">
            <div class="forum-detail_owner">
                <forum-mark-down
                  owner
                  comment
                  :content="owner"
                  @delete="deleteForum"
                  @edit="editForum"
                  @clickLike="toggleLike"
                />
            </div>
            <div class="cutting-line" v-if="comments.length">这些回帖亮了</div>
            <div class="forum-detail_comments">
                <forum-mark-down
                  :comment="owner.userId._id === comment.userId._id"
                  :owner="owner.userId._id === comment.userId._id"
                  v-for="comment in comments"
                  :key="comment._id"
                  :content="comment"
                  @delete="deleteForum"
                  @edit="editCommentForum"
                  @clickLike="toggleLike"
                />
            </div>
            <forum-editor :content="content" :user-info="userInfo" @submit="submit"/>
        </template>
        <empty v-if="isEmpty" text="该成员本周暂无论帖发表" />
    </div>
</template>

<script>
import {
    getFirstDayOfWeek,
    getLastDayOfWeek
} from '@/assets/util/day'
import dateRange from 'components/daterange'
import empty from 'components/empty'
import {
    API_FORUM_DETAIL,
    API_FORUM,
    API_FORUM_LIKE
} from '@/api'
import { markdownEditor } from 'vue-simplemde'
import forumMarkDown from './common/forummarkdown'
import forumEditor from './common/forumeditor'
import { mapState } from 'vuex'

export default {
    name: 'forumDetail',
    components: {
        dateRange,
        markdownEditor,
        forumMarkDown,
        forumEditor,
        empty
    },
    data() {
        return {
            owner: null,
            comments: [],
            content: '',
            userId: this.$route.params.userId,
            forumId: this.$route.params.forumId,
            isEmpty: false,
            isEdit: false
        }
    },
    computed: {
        ...mapState({
            userInfo: 'userInfo'
        })
    },
    mounted() {
        this.beginDate = this.$route.query.beginDate || getFirstDayOfWeek()
        this.endDate = this.$route.query.endDate || getLastDayOfWeek()
        this.initData().then(res => {
            this.$nextTick(() => {
                document.querySelector('.one-team_main').scrollTop = 0
            })
        })
    },
    methods: {
        initData() {
            return new Promise((resolve, reject) => {
                this.$_get(API_FORUM_DETAIL, {
                    beginDate: this.beginDate,
                    endDate: this.endDate,
                    forumId: this.forumId
                }).then(res => {
                    this.content = ''
                    this.owner = res.owner
                    this.isEmpty = res.owner === null
                    this.comments = res.comments
                    resolve(true)
                })
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
        editForum() {
            let query = {
                beginDate: this.beginDate,
                endDate: this.endDate
            }
            if (this.forumId) {
                query = { ...query, ...{ forumId: this.forumId } }
            }
            this.$router.push({
                name: 'forumEdit',
                query
            })
        },
        editCommentForum(content) {
            this.content = content.content
            this.editForumId = content._id
            let index = this.comments.findIndex(data => data._id === this.editForumId)
            this.comments.splice(index, 1)
            this.isEdit = true
        },
        async submit(content) {
            this.content = content
            if (this.isEdit) {
                await this.update()
            } else {
                await this.save()
            }
            this.isEdit = false
        },
        save() {
            let params = {
                userId: this.userInfo._id,
                forumPId: this.forumId,
                content: this.content,
                beginDate: this.beginDate
            }
            return this.$_post(API_FORUM_DETAIL, params).then((res) => {
                this.$message({
                    message: '发布成功！',
                    type: 'success'
                })
                this.initData()
            })
        },
        update() {
            let params = {
                forumId: this.editForumId,
                content: this.content
            }
            return this.$_put(API_FORUM_DETAIL, params).then((res) => {
                this.$message({
                    message: '发布成功！',
                    type: 'success'
                })
                this.initData()
            })
        },
        deleteForum(forumId) {
            this.$confirm('确定要删除你发布的论帖吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$_delete(API_FORUM, { forumId }).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.initData()
                })
            }).catch(() => {
                console.log('已取消删除！')
            })
        },
        toggleLike(forumId, like) {
            let params = {
                forumId,
                like
            }
            this.$_post(API_FORUM_LIKE, params).then(res => {})
        }
    }
}
</script>

<style lang="scss" scoped>

.forum-detail {
    &_header {
        position: relative;
        padding-bottom: 20px;
        margin-bottom: 40px;
        border-bottom: 2px solid #e4e7ed;
    }
    &_list {
        padding: 0 20px;
    }
}
.header-btn {
    position: absolute;
    right: 0;
    top: 15px;
}
.cutting-line {
    color: #025aa8;
    font-size: 20px;
    margin-bottom: 20px;
    padding-left: 16px;
    border-bottom: 1px solid #c0d3eb;
}
</style>
