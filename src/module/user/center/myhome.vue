<template>
    <div>
        <div class="area_info">
            <avator :src="userInfo.headPortrait" style="margin-right: 15px;" width="80px" size="17px" :placeholder="userInfo.nickName" />
            <div class="part_info">
                <p class="user_name">{{userInfo.nickName}}</p>
                <p>{{userLink}}</p>
                <p>{{userInfo.userDesc}}</p>
            </div>
            </div>
            <div class="area_menu">
                <el-tabs v-model="activeName"
                    @tab-click="chooseTab">
                    <el-tab-pane label="周报"
                        name="report">
                        <report-list :isHost="userInfo.isHost"
                            :userId="userId"></report-list>
                    </el-tab-pane>
                    <el-tab-pane label="关注"
                        name="focus">
                        <focus-list :isHost="userInfo.isHost"
                            :userId="userId"></focus-list>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
</template>
<script>
import reportList from './common/reportlist'
import focusList from './common/focuslist'
import avator from 'components/avator'
import {
    API_USER
} from '@/api'
import {
    Tabs,
    TabPane
} from 'element-ui'
export default {
    name: 'myhome',
    data() {
        return {
            userInfo: {
                headPortrait: '',
                eMail: '',
                nickName: '',
                phoneNumber: '',
                userDesc: '',
                isHost: false // 是否是本人
            },
            menuList: [{
                label: '周报',
                param: 'report'
            }, {
                label: '关注',
                param: 'focus'
            }],
            teamId: '',
            showType: 'focus',
            focusList: [],
            activeName: 'report'
        }
    },
    computed: {
        userId() {
            return this.$route.params.userId || ''
        },
        userLink() {
            if (this.userInfo.eMail && this.userInfo.phoneNumber) {
                return this.userInfo.phoneNumber + '/' + this.userInfo.eMail
            } else {
                return this.userInfo.eMail || this.userInfo.phoneNumber
            }
        },
        currentUid() {
            return localStorage.getItem('uid') || ''
        }
    },
    components: {
        reportList,
        focusList,
        elTabs: Tabs,
        elTabPane: TabPane,
        avator
    },
    mounted() {
        this.initUserInfo()
    },
    watch: {
        '$route': {
            handler: 'initUserInfo',
            deep: true,
            immediate: true
        }
    },
    methods: {
        initUserInfo() {
            this.$_get(API_USER, { userId: this.userId }).then((res) => {
                Object.assign(this.userInfo, { headPortrait: require('../image/leader.png') }, res)
            }).catch(error => {
                console.log(error.error)
            })
        },
        chooseTab(tab, event) {
            // console.log(tab, event)
        }
    }
}
</script>
<style lang="scss"
    scoped>
.area_info {
    height: 120px;
    padding: 20px;
    display: flex;

    .part_photo {
        width: 80px;
        height: 80px;
        border-radius: 40px;
        overflow: hidden;
        margin-right: 15px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .part_info {
        padding-top: 5px;

        .user_name {
            font-size: 20px;
            font-weight: bold;
        }
    }
}

.area_menu {
    position: relative;

    &:before {
        content: "";
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 2px;
        background-color: rgb(228, 231, 237);
        z-index: 1;
    }
}

/deep/ .el-tabs__nav-scroll {
    padding: 0 30px;
}
</style>
