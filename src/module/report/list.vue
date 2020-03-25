<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-08 16:43:39
 * @LastEditTime: 2019-07-08 16:43:39
 * @LastEditors: your name
 -->
<template>
    <div class="report-list">
        <div class="date-wrapper">
            <date-range type="week" v-on:change="changeList" />
            <div class="list-write">
                <a href="javsscript:;" @click="goWeeklyConfig" v-if="isAdmin">设置</a>
                <el-button @click="creatWeekly" v-if="write">
                    {{activeName == 'summary' ? '写总结' : '写周报'}}
                </el-button>
            </div>
        </div>
        <el-tabs v-model="activeName"
            @tab-click="handleClick">
            <el-tab-pane label="成员周报"
                name="weekly"></el-tab-pane>
            <el-tab-pane label="小组总结"
                name="summary"></el-tab-pane>
        </el-tabs>
        <div :class="['nav-wrapper', navBarFixed ? 'isFixed' : '']" ref="navWrapper">
            <transition name="nav-animate">
                <report-nav
                  v-if="group.length !== 0"
                  id="navDOMTop"
                  :notWritten="notWritten"
                  :teamList="group"
                  :defaultGroups="defaultGroupIds"
                  @handleChange="handleNavChange"
                  @handleLink="handleLink"
                />
            </transition>
        </div>
        <div class="list-list">
            <report-entry
              v-for="item in list"
              :class="['list-entry', `animation-list`]"
              :style="{ animationDelay: `${item.index * 150+200}ms`}"
              :ref="item.userId._id"
              :key="item._id"
              :reportData="item | reportFilter"
              :isHost="item.userId._id === hostId"
              @reportEdit="creatWeekly"
              @reportDelete="getGroupList(curTeamId)"
            />
            <span v-if="isEmpty" class="empty-wrapper">
                <img :src="emptyImg" class="empty-image" alt="没写周报" />
                <span class="empty-text">还没有成员填写周报</span>
            </span>
            <div
              class="list-nowrite"
              v-if="notWritten.length > 0 && isLazy">
                <p class="list-nowrite-title">
                    <i class="el-icon-warning"></i> {{notWritten.length}} 位成员还未写周报
                </p>
                <el-button
                  v-for="item in notWritten"
                  :key="item.nickName"
                  class="list-nowrite-item"
                  plain
                  size="mini"
                  type="info">
                    {{item.nickName}}
                </el-button>
            </div>
            <div v-if="isLazy && list.length !== 0" class="done">已加载完全部数据~~</div>
        </div>
    </div>
</template>
<script>
import {
    API_REPORT
} from '@/api'
import { scrollUnique } from 'assets/util/scrollBehavior'
import {
    Tabs,
    TabPane
} from 'element-ui'
import {
    getFirstDayOfWeek,
    getLastDayOfWeek
} from '@/assets/util/day'
import { mapState } from 'vuex'
import dateRange from 'components/daterange'
import reportNav from './common/nav'
import reportEntry from 'module/components/report/entry'

export default {
    name: 'reportList',
    data() {
        return {
            activeName: 'weekly',
            list: [],
            isAdmin: false,
            hostId: '',
            obj: {
                year: '',
                weekNum: '',
                begin: '',
                end: ''
            },
            group: [],
            notWritten: [],
            curGroupId: '',
            pageNum: 1,
            curTeamId: 'all',
            navBarFixed: false,
            navDOMTop: '',
            emptyImg: require('../user/center/common/img/fail.png'),
            isEmpty: false,
            finish: false
        }
    },
    components: {
        dateRange,
        reportNav,
        reportEntry,
        'el-tabs': Tabs,
        'el-tab-pane': TabPane
    },
    filters: {
        reportFilter(item) {
            return {
                userId: item.userId._id,
                head: item.userId.headPortrait,
                name: item.userId.nickName,
                date: item.createTime,
                content: item.content,
                reportId: item._id,
                answerListLength: item.answerListLength,
                type: item.weekly
            }
        }
    },
    watch: {
        '$route': {
            handler: 'init',
            deep: true
        }
    },
    computed: {
        ...mapState({
            userInfo: 'userInfo',
            groupId: 'groupId'
        }),
        defaultGroupIds() {
            return [this.userInfo.groupId]
        },
        write() {
            return !(this.activeName === 'summary' && !this.isAdmin)
        },
        beginDate() {
            return this.$route.query.beginDate || getFirstDayOfWeek()
        },
        endDate() {
            return this.$route.query.endDate || getLastDayOfWeek()
        },
        isLazy() {
            if (this.curGroupId !== this.userInfo.teamId) {
                return true
            } else {
                return this.finish
            }
        }
    },
    mounted() {
        this.curGroupId = this.userInfo.groupId
        this.getGroupList()
        this.$nextTick(() => {
            // 子元素scroll父元素容器不跟随滚动JS实现
            scrollUnique('.nav-wrapper')
            this.scrollHandler()
        })
        this.bus.$on('emitEvent', this.busHandler)
    },
    beforeDestroy() {
        this.bus.$off('emitEvent', this.busHandler)
    },
    methods: {
        init() {
            this.pageNum = 1
            this.finish = false
            this.curGroupId = this.groupId
            if (!this.curGroupId) {
                this.curGroupId = this.userInfo.groupId
            }
            this.getGroupList()
        },
        busHandler() {
            if (this.curGroupId === this.userInfo.teamId) {
                this.pageNum++
                this.getGroupList()
            }
        },
        handleNavChange(groupId) {
            document.querySelector('.one-team_main').scrollTo({top: 0})
            this.curGroupId = groupId
            this.pageNum = 1
            this.finish = false
            this.getGroupList()
        },
        getGroupList() {
            if (this.finish) {
                return
            }
            let params = {
                beginDate: this.beginDate,
                endDate: this.endDate,
                groupId: this.curGroupId,
                type: this.activeName
            }
            if (this.curGroupId === this.userInfo.teamId) {
                params = {...params, ...{pageNum: this.pageNum}}
            }
            this.$_get(API_REPORT, params, {loading: true}).then((res) => {
                this.isAdmin = res.isAdmin
                this.hostId = res.hostId
                if (res.list.length < 5) {
                    this.finish = true
                }
                res.list.map((item, index) => {
                    item.index = index
                })
                if (this.pageNum > 1) {
                    this.list = this.list.concat(res.list)
                } else {
                    this.list = res.list
                }
                this.isEmpty = this.list.length === 0
                this.notWritten = res.notWritten
                this.group = res.allTeamInfo
            }).catch(error => {
                console.log(error.error)
            })
        },
        creatWeekly() {
            this.$router.push({
                name: 'reportDetail',
                query: {
                    beginDate: this.beginDate,
                    endDate: this.endDate,
                    type: this.activeName
                }
            })
        },
        changeList(val1 = '', val2 = '') {
            this.$router.push({
                name: 'reportList',
                query: {
                    beginDate: val1,
                    endDate: val2
                }
            })
        },
        goWeeklyConfig() {
            this.$router.push({
                name: 'reportConfig',
                query: {
                    type: this.activeName
                }
            })
        },
        scrollHandler() {
            this.mainEl = document.getElementsByClassName('one-team_main')[0]
            this.mainEl.addEventListener('scroll', () => {
                let scrollTop = this.mainEl.scrollTop
                this.navBarFixed = scrollTop >= 40
            })
        },
        handleClick(tab, event) {
            this.initData()
        },
        handleLink(id) {
            let anchor = this.$refs[id][0].$el
            this.mainEl.scrollTop = anchor.offsetTop
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/style/base.scss';

.list-hd {
    text-align: center;
    padding-top: 15px;
}

.list-hd-pic {
    width: 50px;
}

.list-bd {
    ol li {
        list-style-position: inside;
    }

    img {
        max-width: 80%;
        height: auto;
    }
}
.nav-wrapper {
    position: absolute;
    top: 40px;
    bottom: 0;
    transform: translateX(-120%);
    overflow-y: overlay;
}
.isFixed {
    position: fixed;
    top: 60px;
}

.list {
    padding: 10px 0;
    &-list {
        position: relative;
    }
}

.list-content::after {
    content: " ";
    position: absolute;
    box-sizing: content-box;
    width: 95%;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    margin: 0 auto;
    background-color: $colorLine;
}

.list-entry {
    padding: 20px 20px 10px;
    border-bottom: 1px solid #e4e7ed;
}
.date-wrapper {
    position: relative;
}
.list-write {
    position: absolute;
    right: 0;
    bottom: 0;
}

.list-btn_left {
    position: absolute;
    left: 10px;
    top: 50px;
}

.list-nowrite {
    padding-top: 20px;
}

.list-nowrite-title {
    font-size: 16px;
    margin-bottom: 10px;
    color: #999;
}

.list-nowrite-item {
    height: 40px;
    border-radius: 20px;
    margin: 4px;
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
.list-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
.done {
    font-size: 18px;
    color: #909399;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: -52px;
}
</style>
