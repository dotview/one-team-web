<template>
    <div class="one-team_header">
        <div class="nav">
            <div class="nav-logo" @click="goHome">
                <img class="logo" src="../../../assets/icon/logo1.png" alt="" />
                <span>ONE TEAM</span>
                <span v-if="this.nodeEnv !=='production'" style="color:red;">
                    {{this.nodeEnv}}
                </span>
            </div>
            <el-menu
              :default-active="active"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect">
                <!-- <el-menu-item index="home">面板</el-menu-item> -->
                <el-menu-item index="report" :class="{ transparent: isHome }">汇报</el-menu-item>
                <el-menu-item index="team" :class="{ transparent: isHome }">团队</el-menu-item>
                <el-menu-item index="forum" :class="{ transparent: isHome }">分享</el-menu-item>
                <el-menu-item index="okr" :class="{ transparent: isHome }">OKR<img class="new" src="../../../assets/icon/new.png" alt="new" /></el-menu-item>
                <el-menu-item index="personalCenter" :class="{ transparent: isHome }">我自己</el-menu-item>
                <!-- style="position: relative;" -->
                <!-- <el-menu-item @click="isShowNotification=!isShowNotification"
                        index="notice"
                        disabled
                        class="nav-notice">
                        <el-badge :value="12"
                            class="item">
                            <img src="../../../assets/icon/notice.png" alt="" >
                        </el-badge>
                            <notification :isShow="isShowNotification" />
                    </el-menu-item> -->
                <li
                  ref="noticeBox"
                  class="nav-notice"
                  @click="isShowNotification = !isShowNotification">
                    <el-badge
                      :value="msgboxCount"
                      :hidden="!msgboxCount"
                      class="item">
                        <img
                          :class="{unread:msgboxCount}"
                          src="../../../assets/icon/notice.png"
                          alt=""
                        />
                    </el-badge>
                        <notification
                          :isShow="isShowNotification"
                          @read="handlerRead"
                          @close="hideMsgbox"
                        />
                </li>
                <el-submenu index="center">
                    <template slot="title">
                        <img
                          :src="myHead"
                          alt=""
                          class="nav-head"
                        />
                    </template>
                        <el-menu-item index="settings">账户设置</el-menu-item>
                        <el-menu-item index="signout">退出</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
    </div>
</template>
<script>
import { API_APPLICATION } from '@/api'
import { Menu, Submenu, MenuItem } from 'element-ui'
import notification from '../notification/index'
import { cookie } from '@/assets/js/cookie'
import { mapState } from 'vuex'
export default {
    name: 'headerbar',
    data() {
        return {
            nodeEnv: process.env.NODE_ENV,
            isShowNotification: false,
            routerLink: {
                // home: 'teamDashBoard',
                report: 'reportList',
                team: 'teamList',
                project: 'projects',
                personalCenter: 'personalCenter',
                forum: 'forumList',
                okr: 'okrList',
                settings: 'settings'
            },
            msgboxCount: 0,
            id: '',
            myHead: require('@/assets/icon/head.png'),
            isHome: false
        }
    },
    components: {
        'el-menu': Menu,
        'el-submenu': Submenu,
        'el-menu-item': MenuItem,
        notification
    },
    computed: {
        active() {
            if (this.$route.path.indexOf('/reportList') > 0) {
                return 'report'
            } else if (this.$route.path.indexOf('/teamList') > 0) {
                return 'team'
            } else if (this.$route.path.indexOf('/user') > 0) {
                return 'personalCenter'
            } else if (this.$route.path.indexOf('/forum') > 0) {
                return 'forum'
            } else if (this.$route.path.indexOf('/okr') > 0) {
                return 'okr'
            } else {
                return ''
            }
        },
        ...mapState({
            userInfo: 'userInfo'
        })
    },
    created() {
        this.initUserInfo()
    },
    mounted() {
        // body 点击时 隐藏消息盒子
        this.handlerBodyClick()
    },
    methods: {
        goHome() {
            this.$router.push({
                name: 'home'
            })
            this.isHome = true
        },
        initUserInfo() {
            if (this.userInfo.headPortrait) {
                this.myHead = this.userInfo.headPortrait
            }
            this.id = this.userInfo._id
            this.msgboxCount = this.userInfo.msgboxCount
        },
        handleSelect(key, keyPath) {
            this.isHome = false
            if (key === 'signout') {
                this.submitSignout()
            } else {
                let id = null
                if (key === 'personalCenter') {
                    id = this.id
                }
                let nameLink = this.routerLink[key]
                if (nameLink && id) {
                    this.$router.push({
                        name: nameLink,
                        params: {
                            userId: id
                        }
                    })
                } else {
                    this.$router.push({
                        name: nameLink
                    })
                }
            }
        },
        hideMsgbox() {
            this.isShowNotification = false
        },
        handlerRead(type, hide) {
            if (type === 'single') {
                this.msgboxCount -= 1
            } else {
                this.msgboxCount = 0
            }
        },
        handlerBodyClick() {
            document.body.addEventListener(
                'click',
                e => {
                    if (
                        this.isShowNotification &&
                        !this.$refs.noticeBox.contains(e.target)
                    ) {
                        this.hideMsgbox()
                    }
                },
                true
            )
        },
        submitSignout() {
            this.$_delete(API_APPLICATION)
                .then(res => {
                    this.clean()
                })
                .catch(error => {
                    console.log(error.error)
                    this.clean()
                })
        },
        clean() {
            localStorage.removeItem('token')
            cookie.clear('team', '/')
            cookie.clear('name', '/')
            cookie.clear('token', '/')
            this.$router.replace({
                name: 'login'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.one-team_header {
    background-color: #fff;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    box-shadow: 0 2px 8px #f0f1f2;
    z-index: 1200;
}

.nav {
    width: 960px;
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
}

.el-menu-demo {
    display: flex;
    border: 0;
}

.nav-notice {
    line-height: 60px;
    cursor: pointer;
    padding: 0 20px;
    position: relative;

    /deep/ .el-badge {
        line-height: 20px;
    }

    img {
        width: 20px;

        &.unread {
            -webkit-animation: bellshake 2s ease-out infinite;
            animation: bellshake 2s ease-out infinite;
            -webkit-transform-origin: center top;
            transform-origin: center top;
        }
    }
}

.nav-head {
    width: 40px;
    height: 40px;
    border-radius: 20px;
}

.nav-logo {
    cursor: pointer;
    &:hover {
        .logo {
            transform: scale(1.1, 1.1)
        }
    }
    .logo {
        transition: transform .3s ease;
        vertical-align: middle;
        width: 60px;
    }
}
.transparent {
    border-bottom-color: transparent!important;
    color: #909399!important;
}
@keyframes bellshake {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    3.75% {
        -webkit-transform: rotate(25deg);
        transform: rotate(25deg);
    }

    15% {
        -webkit-transform: rotate(-25deg);
        transform: rotate(-25deg);
    }

    22.5% {
        -webkit-transform: rotate(15deg);
        transform: rotate(15deg);
    }

    29% {
        -webkit-transform: rotate(-10deg);
        transform: rotate(-10deg);
    }

    35% {
        -webkit-transform: rotate(5deg);
        transform: rotate(5deg);
    }

    43% {
        -webkit-transform: rotate(-2deg);
        transform: rotate(-2deg);
    }

    50%,
    100% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
}
.new {
    position: absolute;
    width: 25px;
    height: 25px;
    right: 0px;
}
</style>
