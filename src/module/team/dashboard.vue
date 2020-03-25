<template>
    <div class="dashboard">
        <div class="part_top">
            <!-- <span>My Team</span>
            <span>My Fellow</span> -->
            <!-- <input type="text" class="searchBox"> -->
        </div>
        <div class="part_middle"
            v-if="!loading">
            <h2>{{titleTxt}}</h2> <span class="btn" v-if="showType == 'specialFocus'" @click="goPage('user/mysub')">Edit</span>
            <div class="vision_type">
                <span class="vision_nest" @click="showTypeList = !showTypeList"></span>
                <ul v-show="showTypeList">
                    <li @click="setType('childTeam')">下级部门</li>
                    <li @click="setType('allTeam')">所有部门</li>
                    <li @click="setType('specialFocus')">特别关注</li>
                </ul>
                <!-- <span class="vision_list"></span> -->
            </div>
            <div>
                <!-- 直属下级部门 -->
                <section v-show="showType == 'childTeam'">
                    <ul class="ot-cells">
                        <li v-for="item in childTeamList"
                            :key="item.id"
                            class="ot-cell"
                            @click="goToTeam(item)">
                            <div class="cell-hd">
                                <span class="circle_name">{{item.teamName | nameFilter}}</span>
                            </div>
                            <div class="cell-bd">
                                <p class="team_name">
                                    {{item.teamName}}
                                </p>
                                <p>
                                    <!-- Leader：<span class="team_admin">{{item.administrator.nickName}}</span> -->
                                </p>
                            </div>
                            <div class="cell-ft">
                                <p class="">more>>>
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>
                <!-- 所有部门 -->
                <section class="section_allteam"
                    v-show="showType == 'allTeam'">
                    <el-tree ref="teamTree"
                        :data="teamAllList"
                        :props="defaultProps"
                        @node-click="showTeamDetail"></el-tree>
                    <div class="team_detail"
                        v-if="curTeam.teamName"
                        @click="goToTeam(curTeam)">
                        <p class="info_line">
                            <span class="info_icon team_name"></span>
                            <span>{{curTeam.teamName}}</span>
                        </p>
                        <p class="info_line">
                            <span class="info_icon team_admin"></span> {{curTeam.administrator.nickName}}
                        </p>
                        <p class="info_line">
                            <span class="info_icon team_email"></span> {{curTeam.administrator.eMail}}
                        </p>
                        <p class="entry_more">
                            more>>>
                        </p>
                    </div>
                </section>
                <section class="section_focus"
                    v-show="showType == 'specialFocus'">
                    <div v-if="!focusList.length">
                        <p class="btn_add__large"
                            @click="goPage('user/mysub')"></p>
                        <p>还没有特别关注，快去添加吧</p>
                    </div>
                    <div v-else>
                        <ul class="list_sub">
                            <li v-for="item in focusList"
                                :key="item.id"
                                @click="goPage('weeklyList', item)">
                                <span class="unit_photo"></span>
                                <span>{{item.subUserName}}</span>
                                <span>{{item.subUserTeam}}</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
<script>
import {
    Tree
} from 'element-ui'
import {
    // getTeamInfo,
    getChildTeamInfo,
    getTeamList
} from '@/api/team'
import {
    API_RECORD
} from '@/api'
export default {
    name: 'dashboard',
    data() {
        return {
            loading: true,
            curTeam: {
                administrator: {
                    nickName: '',
                    eMail: ''
                }
            },
            childTeamList: [],
            showTypeList: false,
            showType: 'childTeam',
            teamAllList: [],
            /* tree data */
            defaultProps: {
                label: 'teamName'
            },
            /* focus */
            focusList: []
        }
    },
    computed: {
        titleTxt() {
            return ({
                childTeam: '直属下级部门',
                allTeam: '所有部门',
                specialFocus: '特别关注'
            })[this.showType]
        }
    },
    filters: {
        nameFilter(val) {
            return val.length > 2 ? val.substr(0, 2) : val
        }
    },
    mounted() {
        // this.getMyTeam()
        // this.getChildInfo()
        // this.getTeamListInfo()
        // this.getFocusList()
    },
    components: {
        'el-tree': Tree
    },
    methods: {
        getChildInfo() {
            getChildTeamInfo().then((res) => {
                this.childTeamList = res.result
                this.loading = false
                console.log(this.childTeamList)
            })
        },
        getTeamListInfo() {
            getTeamList().then((res) => {
                if (res.success && res.result) {
                    this.teamAllList = this.reformate(res.result)
                }
            })
        },
        getFocusList() {
            this.$_get(API_RECORD).then((res) => {
                if (res.success && res.result.length) {
                    this.focusList = res.result
                }
            })
        },
        reformate(dataList) {
            let pidArr = []
            let childArr = []
            dataList.forEach((item) => {
                if (!item.pid) {
                    item.children = []
                    pidArr.push(item)
                } else {
                    childArr.push(item)
                }
            })
            this.curTeam = pidArr[0]
            console.log(this.curTeam)
            childArr.forEach((citem) => {
                pidArr.forEach((pitem) => {
                    if (citem.pid === pitem._id) {
                        pitem.children.push(citem)
                    }
                })
            })
            return pidArr
        },
        goToTeam(team) {
            this.$router.push({
                path: '/page/teamInfo',
                query: {
                    team: team._id,
                    name: team.teamName
                }
            })
        },
        setType(type) {
            this.showType = type
            this.showTypeList = false
        },
        showTeamDetail(team) {
            this.curTeam = team
        },
        goPage(path, params) {
            let query = {}
            if (path === 'weeklyList') {
                query = {
                    id: params.subUserId
                }
            }
            this.$router.push({
                path,
                query
            })
        }
    }
}
</script>
<style lang='scss'
    scoped>
@import '../../assets/style/base.scss';

.cell-hd {
    width: 50px;
    text-align: center;
}

.cell-hd-pic {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    line-height: 50px;
}

.ot-cells {
    margin-top: 30px;
    padding: 0;
}

.ot-cell {
    min-height: 60px;
    align-items: center;
    display: flex;
}

.cell-bd {
    margin-left: 20px;
    flex-grow: 1;

    p {
        margin: 5px 0;
    }

    .team_name {
        font-weight: bold
    }
}

.cell-hd-name {
    font-size: $fontSizeLevel6;
}

.circle_name {
    display: inline-block;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: #FFEBEE;
    text-align: center;
    line-height: 55px;
}

.cell-ft {
    flex-basis: 60px;

    .status_report {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #FFEBEE;
        text-align: center;
        line-height: 50px;
    }
}

.part_middle {
    position: relative;

    h2 {
        /* border-bottom: 1px solid #aaa8a8;
        padding-bottom: 20px;*/
        display: inline-block;
    }

    .vision_type {
        position: absolute;
        right: 0;
        top: 7px;
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: space-between;

        span {
            display: inline-block;
            width: 25px;
            height: 25px;
            /*opacity: 0.35;*/
            background: url('./image/list_gray_deep.png') 0 center no-repeat;
            background-size: cover;
        }

        ul {
            position: absolute;
            left: -26px;
            top: 17px;
            z-index: 9;
            width: 77px;
            background: #e9e9e9;
            border-radius: 5px;
            text-align: center;
            padding: 3px 6px 8px;
        }

        li {
            margin-top: 5px;
            border-bottom: 1px solid #ccc;
        }
    }
}

.section_allteam {
    display: flex;

    .team_detail {
        display: inline-block;
        /*width: 48%;*/
        border: 2px solid #000;
        border-radius: 10px;
        padding: 20px;
        flex: 1;
    }

    .info_line {
        display: flex;
        align-items: center;

        .info_icon {
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-right: 10px;
            /*flex-basis: 40px;*/
        }
    }

    .team_name {
        background: url('./image/team.png') 0 center no-repeat;
        background-size: cover;
    }

    .team_admin {
        background: url('./image/leader.png') 0 center no-repeat;
        background-size: cover;
    }

    .team_email {
        background: url('./image/message.png') 0 center no-repeat;
        background-size: cover;
    }

    .entry_more {
        text-align: right;
    }
}

.el-tree {
    display: inline-block;
    /*width: 48%;*/
    background: #f9f9f9;
    flex: 1;

    .el-tree-node__label {
        font-size: 16px !important;
    }
}

.section_focus {
    .btn_add__large {
        width: 120px;
        height: 120px;
        background: url('./image/add_focus.png') 0 center no-repeat;
        background-size: cover;
        margin: 140px auto 0;
    }

    p {
        text-align: center;
        margin: 0;
    }

    .list_sub {
        display: flex;
        flex-wrap: wrap;
        padding: 20px;

        li {
            position: relative;
            width: 120px;
            /*height: 110px;*/
            line-height: 30px;
            background: #fff;
            border-radius: 15px;
            text-align: center;
            padding-top: 15px;
            padding-bottom: 15px;
            margin: 5px;
            border: 2px solid #000;

            span {
                display: block;
                text-align: center;
                width: 100%;
                overflow: hidden;
            }

            .unit_photo {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #FFEBEE;
                background: url('./image/leader.png') 0 center no-repeat;
                background-size: cover;
                margin: 0 auto;
            }

            .btn_del {
                position: absolute;
                right: -8px;
                top: -8px;
                width: 25px;
                height: 25px;
                text-align: center;
                line-height: 25px;
                background: #000;
                color: #fff;
                border-radius: 50%;
            }

            .btn_add {
                width: 70px;
                height: 70px;
                margin: 20px auto;
                background: url('./image/add2.png') 0 center no-repeat;
                background-size: cover;
                opacity: 0.15;
            }
        }
    }
}
</style>
