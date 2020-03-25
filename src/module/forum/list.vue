<template>
    <div class="forum-list">
        <div class="forum-list_header">
            <date-range type="week" v-on:change="changeList" />
            <el-button class="header-btn" type="primary" @click="editForum('', $event)">发布本周新帖</el-button>
        </div>
        <transition name="nav-forum-animate">
            <div v-if="participant.length !== 0" :class="['forum-list_nav', navBarFixed ? 'isFixed' : '']">
                <div class="nav-title">{{ participant.length }} 位参与者</div>
                <div class="nav-body">
                    <a
                    href="javascript:void(0);"
                    v-for="item in participant"
                    :title="item.nickName"
                    :key="item._id"
                    @click="handleAnchor(item.forumId)"
                    class="nav-item">
                        <avator :src="item.headPortrait" width="32px" radius="5px" size="12px" :placeholder="item.nickName" />
                    </a>
                </div>
            </div>
        </transition>
        <div class="forum-list_list">
            <forum-mark-down
              v-for="item in list"
              :ref="item._id"
              :key="item._id"
              :content="item"
              class="animation-list"
              @delete="deleteForum"
              @edit="editForum"
              @clickComment="goDetail"
              @clickLike="toggleLike"
              owner
            />
            <empty v-if="isEmpty" text="本周暂无热帖" />
        </div>
        <div
          class="list-nowrite"
          v-if="notWritten.length > 0">
            <p class="list-nowrite-title">
                <i class="el-icon-warning"></i> {{notWritten.length}} 位成员还未发布本周论帖
            </p>
            <el-button
              v-for="item in notWritten"
              plain
              class="list-nowrite-item"
              :key="item.nickName"
              size="mini"
              type="info">
                {{item.nickName}}
            </el-button>
        </div>
    </div>
</template>

<script>
import {
    API_FORUM,
    API_FORUM_LIKE
} from '@/api'
import dateRange from 'components/daterange'
import forumMarkDown from './common/forummarkdown'
import empty from 'components/empty'
import {
    getFirstDayOfWeek,
    getLastDayOfWeek
} from '@/assets/util/day'
import avator from 'components/avator'
import { mapState } from 'vuex'

export default {
    name: 'forumList',
    components: {
        dateRange,
        forumMarkDown,
        empty,
        avator
    },
    data() {
        return {
            list: [],
            participant: [],
            isEmpty: false,
            notWritten: [],
            navBarFixed: false,
            curForumId: '',
            scrollTop: ''
        }
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
    mounted() {
        this.$nextTick(() => {
            // 子元素scroll父元素容器不跟随滚动JS实现
            this.scrollHandler()
        })
    },
    activated() {
        if (this.scrollTop > 0) {
            document.querySelector('.one-team_main').scrollTo(0, this.scrollTop)
        }
    },
    beforeRouteLeave(to, from, next) {
        if (to.name === 'forumDetail') {
            this.$store.commit('SET_KEEP_ALIVE', ['forumList'])
        } else {
            this.$store.commit('SET_KEEP_ALIVE', [])
        }
        next()
    },
    methods: {
        init(to, from) {
            this.beginDate = this.$route.query.beginDate || getFirstDayOfWeek()
            this.endDate = this.$route.query.endDate || getLastDayOfWeek()
            this.getForumList()
        },
        getForumList() {
            let params = {
                beginDate: this.beginDate,
                endDate: this.endDate
            }
            this.$_get(API_FORUM, params, {loading: true}).then((res) => {
                this.list = res.list
                this.participant = []
                this.list.map(data => {
                    let index = this.participant.findIndex(item => item._id === data.userId._id)
                    if (index < 0) {
                        this.participant.push({...data.userId, ...{forumId: [data._id]}})
                    } else {
                        this.participant[index].forumId.push(data._id)
                    }
                })
                this.notWritten = res.notWritten
                this.isEmpty = res.list.length === 0
            })
        },
        changeList(val1 = '', val2 = '') {
            this.$router.push({
                name: 'forumList',
                query: {
                    beginDate: val1,
                    endDate: val2
                }
            })
        },
        goDetail(forumId) {
            this.scrollTop = document.querySelector('.one-team_main').scrollTop
            this.$router.push({
                name: 'forumDetail',
                query: {
                    beginDate: this.beginDate,
                    endDate: this.endDate
                },
                params: {
                    forumId
                }
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
                    this.getForumList()
                })
            }).catch(() => {
                console.log('已取消删除！')
            })
        },
        editForum(content) {
            let query = {
                beginDate: this.beginDate,
                endDate: this.endDate
            }
            if (content._id) {
                query = { ...query, ...{ forumId: content._id } }
            }
            this.$router.push({
                name: 'forumEdit',
                query
            })
        },
        toggleLike(forumId, like) {
            let params = {
                forumId,
                like
            }
            this.$_post(API_FORUM_LIKE, params).then(res => {})
        },
        scrollHandler() {
            this.mainEl = document.getElementsByClassName('one-team_main')[0]
            this.mainEl.addEventListener('scroll', () => {
                let scrollTop = this.mainEl.scrollTop
                this.navBarFixed = scrollTop >= 145
            })
        },
        handleAnchor(id) {
            let index = id.findIndex(data => data === this.curForumId)
            if (index < 0) {
                this.curForumId = id[0]
            } else {
                this.curForumId = this.curForumId === id[id.length - 1] ? id[0] : id[index + 1]
            }
            let anchor = this.$refs[this.curForumId][0].$el
            // this.mainEl.scrollTop = anchor.offsetTop + 40
            this.mainEl.scrollTo({
                top: anchor.offsetTop + 40,
                behavior: 'smooth'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.forum-list {
    position: relative;
    &_header {
        position: relative;
        padding-bottom: 20px;
        margin-bottom: 40px;
        border-bottom: 2px solid #e4e7ed;
    }
    &_list {
        padding: 0 20px;
    }
    &_nav {
        position: absolute;
        width: 131px;
        top: 90px;
        transform: translateX(-120%);
        background: #fff;
        padding: 10px;
        border-radius: 5px;
    }
}
.header-btn {
    position: absolute;
    right: 20px;
    top: 15px;
}
.list-nowrite {
    padding-top: 20px;
    &-title {
        font-size: 16px;
        margin-bottom: 10px;
        color: #999;
    }
    &-item {
        height: 40px;
        border-radius: 20px;
        margin: 4px;
    }
}
.empty {
    &-wrapper {
        width: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
    }
    &-image {
        margin: 30px 0;
        width: 200px;
    }
    &-text {
        font-size: 18px;
    }
}
.nav {
    &-title {
        margin-bottom: 12px;
        padding-bottom: 6px;
        font-size: 14px;
        color: #586069;
        font-weight: 600;
        border-bottom: 1px solid #e1e4e8;
    }
    &-body {
        display: flex;
        flex-wrap: wrap;
    }
    &-item {
        display: inline-block;
        width: 32px;
        height: 32px;
        margin-right: 5px;
        margin-bottom: 5px;
    }
}
.isFixed {
    position: fixed;
    top: 65px;
}
</style>
