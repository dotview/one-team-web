<template>
    <div class="shadow">
        <div class="title">
            <h1>管理团队</h1>
        </div>
        <div class="page_TM">
            <!-- basic show part -->
            <div class="part_left">
                <p class="search_unit">
                    <el-input class="txt__search"
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                    </el-input>
                    <span class="btn btn__search" @click="search"></span>
                </p>
                <el-tree highlight-current
                    ref="teamTree"
                    :data="teamList"
                    :props="defaultProps"
                    @node-click="getInfo"
                    :filter-node-method="filterNode"></el-tree>
                <p class="btn_tm"
                    @click="dgTMShow = true">
                    小组管理
                </p>
            </div>
            <div class="part_right">
                <h3>{{currentTeam.name}}</h3>
                <p class="btn_addmem"
                    @click="dgMMShow = true"
                    v-if="teamList.length">添加成员</p>
                <el-table ref="multipleTable"
                    :data="teamDetail"
                    tooltip-effect="blue"
                    style="width: 100%">
                    <!-- max-height="500" -->
                    <el-table-column type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column prop="nickName"
                        label="姓名"
                        width="80">
                    </el-table-column>
                    <el-table-column prop="eMail"
                        label="邮箱">
                    </el-table-column>
                    <el-table-column prop="type"
                        label="成员类别">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.type !== '管理员'"
                                size="middle"
                                @click="memOperate('admin', scope.row)">升级</el-button>
                            <el-button v-if="scope.row.type !== '管理员'"
                                size="middle"
                                type="danger"
                                @click="memOperate('del', scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- floating dialog -->
            <!-- Team Management -->
            <div class="dialog__container"
                v-show="dgTMShow">
                <div class="dialog__content dialog_tm">
                    <div class="block_btns">
                        <span class="btns btn_add__team" :class="{'active': activeBtn === 'add'}" @click="teamEditClick('add')">Add
                            </span>
                        <span class="btns btn_del__team" :class="{'active': activeBtn === 'del'}" @click="teamEditClick('del')">Del</span>
                        <span class="btns btn_edit__team" :class="{'active': activeBtn === 'edit'}" @click="teamEditClick('edit')">Edit</span>
                    </div>
                    <h3>小组管理{{tmTipTxt}}</h3>
                    <span class="btn_dg__close" @click="dgTMShow = false">X</span>
                    <div class="block_content">
                        <section class="section_add"
                            v-show="activeBtn === 'add'">
                            <p class="block_input">
                                <p class="line_input">
                                    <label for="name">所属：</label>
                                    <span> {{rootTeam.teamName}} </span>
                                    <input name="name"
                                        type="hidden"
                                        v-model="rootTeam._id">
                                </p>
                                <p class="line_input">
                                    <label for="email">名称：</label>
                                    <input name="email"
                                        type="text"
                                        v-model="teamInfo.teamName">
                                </p>
                                <!-- <p class="line_input">
                                        <label for="teamId">管理员：</label>
                                        <input name="teamId" type="text" v-model="teamInfo.administrator">
                                    </p> -->
                            </p>
                            <p class="btn_addmem_submit"
                                @click="addTeamSubmit('add')">
                                保存
                            </p>
                        </section>
                        <section class="section_edit"
                            v-show="activeBtn === 'edit'">
                            <p class="block_input">
                                <p class="line_input">
                                    <label for="name">team： </label>
                                    <el-select v-model="teamInfo._id"
                                        placeholder="请选择Team">
                                        <el-option v-for="item in childrenList"
                                            :key="item._id"
                                            :label="item.teamName"
                                            :value="item._id">
                                        </el-option>
                                    </el-select>
                                </p>
                                <p class="line_input">
                                    <label for="email">名称：</label>
                                    <input name="email"
                                        type="text"
                                        v-model="teamInfo.teamName">
                                </p>
                            </p>
                            <p class="btn_addmem_submit"
                                @click="addTeamSubmit('edit')">
                                更新
                            </p>
                        </section>
                        <section class="section_delete"
                            v-show="activeBtn === 'del'">
                            <el-select v-model="teamInfo._id"
                                placeholder="请选择Team">
                                <el-option v-for="item in childrenList"
                                    :key="item._id"
                                    :label="item.teamName"
                                    :value="item._id">
                                </el-option>
                            </el-select>
                            <p class="btn_addmem_submit"
                                @click="deleteTeamSubmit">
                                确认删除
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <!-- Member Management -->
            <div class="dialog__container"
                v-show="dgMMShow">
                <div class="dialog__content">
                    <h3>添加成员</h3>
                    <!-- ({{currentTeam.name}}) -->
                    <span class="btn_dg__close" @click="dgMMShow = false">X</span>
                    <div class="tab_head">
                        <span class="tab_quick" :class="{'active': invite_quick}" @click="invite_quick = true">快速添加</span>
                        <span class="tab_email" :class="{'active': !invite_quick}" @click="invite_quick = false">邮件邀请</span>
                    </div>
                    <div class="tab_content">
                        <div v-if="invite_quick"
                            class="content_quick">
                            <p class="block_input">
                                <p class="line_input">
                                    <label for="name">姓名：</label>
                                    <input name="name"
                                        type="text"
                                        v-model="memInfo.name">
                                </p>
                                <p class="line_input">
                                    <label for="email">邮箱：</label>
                                    <input name="email"
                                        type="text"
                                        v-model="memInfo.eMail">
                                </p>
                                <p class="line_input">
                                    <label for="teamId">所属Team：</label>
                                    <el-select v-model="memInfo.teamId"
                                        placeholder="请选择Team">
                                        <el-option v-for="item in childrenList"
                                            :key="item._id"
                                            :label="item.teamName"
                                            :value="item._id">
                                        </el-option>
                                    </el-select>
                                </p>
                                <p class="tips">*登录账号与默认密码均为邮箱地址</p>
                            </p>
                            <p class="btn_addmem_submit"
                                @click="addMemberSubmit">
                                添加成员
                            </p>
                        </div>
                        <div v-else
                            class="content_email">
                            <p class="block_input">
                                <p class="line_input"
                                    v-for="n in emailList.length"
                                    :key="n.id">
                                    <label for="email">邮箱：</label>
                                    <input name="email"
                                        type="text"
                                        v-model="emailList[n-1]">
                                    <span class="btn_delete" v-show="emailList.length > 1" @click="deleteEmail(n-1)"></span>
                                </p>
                                <p class="tip_addemail"
                                    @click="addOneEmail">添加一个邮箱</p>
                            </p>
                            <p class="btn_addmem_submit"
                                @click="sendInvite">
                                发送邀请
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    Tree,
    Table,
    TableColumn,
    Input,
    Select,
    Option,
    Button
} from 'element-ui'
import {
    getPermissionTeamList,
    getMembers,
    createTeam,
    updateTeam,
    deleteTeam,
    addMem2Team,
    sendEmail,
    updateMembers
} from '@/api/team'
export default {
    name: 'teamManage',
    data() {
        return {
            teamListOrigin: [],
            childrenList: [],
            rootTeam: {
                teamName: '',
                _id: ''
            },
            defaultProps: {
                label: 'teamName'
            },
            teamDetail: [],
            filterText: '',
            dgTMShow: false, // dialogTeamManage
            dgMMShow: false, // dialogMemManage
            currentTeam: {
                name: '无'
            },
            invite_quick: true,
            curAdminId: '',
            memInfo: {
                name: '',
                eMail: '',
                team: ''
            },
            editFlag: false,
            activeBtn: 'add',
            teamInfo: {
                id: '',
                name: '',
                pid: ''
            },
            emailList: [''],
            operatTeamId: ''
        }
    },
    computed: {
        teamList() {
            if (this.teamListOrigin.length) {
                return this.reformate(this.teamListOrigin)
            } else {
                return []
            }
        },
        tmTipTxt() {
            let txt = ({
                'add': '添加子部门',
                'del': '删除子部门',
                'edit': '重命名'
            })[this.activeBtn]

            if (txt) {
                txt = '--' + txt
            }

            return txt
        }
    },
    components: {
        'el-tree': Tree,
        'el-table': Table,
        'el-table-column': TableColumn,
        'el-input': Input,
        'el-select': Select,
        'el-option': Option,
        'el-button': Button
    },
    created() {
        this.loadTeamList()
    },
    methods: {
        loadTeamList() {
            getPermissionTeamList().then((data) => {
                if (data.success && data.result.length) {
                    this.teamListOrigin = data.result
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
            this.rootTeam = pidArr[0] || childArr[0]
            this.getInfo(pidArr[0] || childArr[0])
            this.childrenList = childArr
            childArr.forEach((citem) => {
                pidArr.forEach((pitem) => {
                    if (citem.pid === pitem._id) {
                        pitem.children.push(citem)
                    }
                })
            })
            if (pidArr.length) {
                return pidArr
            } else {
                return childArr
            }
            // return (pidArr || childArr)
        },
        /* tree node filter */
        search() {
            this.$refs.teamTree.filter(this.filterText)
        },
        filterNode(value, data) {
            if (!value) return true
            return data.teamName.indexOf(value) !== -1
        },
        getInfo(team) {
            let teamId = team._id

            this.curAdminId = team.administrator
            this.operatTeamId = team._id

            getMembers({
                teamId
            }).then((data) => {
                if (data.success && data.result) {
                    this.teamDetail = this.formateData(data.result.memberList)
                    this.currentTeam.name = data.result.teamName
                    this.currentTeam.num = data.result.memberList.length
                }
            })
        },
        formateData(data) {
            data.map((item) => {
                item.type = (item._id === this.curAdminId) ? '管理员' : '成员'
            })

            return data
        },
        memOperate(str, row) {
            console.log(str, row)
            updateMembers({
                opera: str,
                userId: row._id,
                teamId: this.operatTeamId
            }).then((data) => {
                if (data.success) {
                    window.location.reload()
                } else {
                    alert(data.resultDesc || '系统异常，请稍后再试')
                }
            })
        },
        /* Member Management */
        addMemberSubmit() {
            let {
                name,
                eMail,
                teamId
            } = this.memInfo

            if (!name) {
                alert('name can\'t be null')
                return
            }
            if (!eMail) {
                alert('eMail can\'t be null')
                return
            }
            if (!teamId) {
                alert('team can\'t be null')
                return
            }

            addMem2Team(this.memInfo).then((data) => {
                if (data.success) {
                    this.dgMMShow = false
                } else {
                    alert(data.resultDesc || '系统异常，请稍后再试')
                }
            })
        },
        addOneEmail() {
            this.emailList.push('')
            console.log('enter click')
        },
        deleteEmail(i) {
            if (i === 0) {
                this.emailList.shift()
            } else {
                this.emailList.splice(i)
            }
        },
        sendInvite() {
            sendEmail({
                email: this.emailList.join(',')
            }).then((res) => {
                if (res.success) {
                    alert('邀请已发出')
                }
            })
        },
        /* Team Management */
        teamEditClick(btn) {
            this.activeBtn = btn
        },
        addTeamSubmit(type) {
            if (!this.teamInfo.teamName) {
                alert('teamName can\'t be null')
                return
            }

            if (type === 'add') {
                this.teamInfo.pid = this.rootTeam._id

                createTeam(this.teamInfo).then((data) => {
                    this.dgTMShow = false
                    if (data.success) {
                        this.loadTeamList()
                    } else {
                        alert(data.result.message || '系统异常，请稍后再试')
                    }
                })
            } else {
                updateTeam(this.teamInfo).then((data) => {
                    this.dgTMShow = false
                    if (data.success) {
                        this.loadTeamList()
                    } else {
                        alert(data.result.message || '系统异常，请稍后再试')
                    }
                })
            }
        },
        deleteTeamSubmit() {
            if (!this.teamInfo._id) {
                alert('please pick one firstly')
                return
            }

            if (window.confirm('确定删除么？')) {
                deleteTeam({
                    _id: this.teamInfo._id
                }).then((data) => {
                    this.dgTMShow = false
                    if (data.success) {
                        this.loadTeamList()
                    } else {
                        alert(data.result.message || '系统异常，请稍后再试')
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss"
    scoped>
* {
    box-sizing: border-box;
}

.dialog__container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 99;

    .dialog__content {
        position: absolute;
        left: 50%;
        top: 28%;
        width: auto;
        height: auto;
        -webkit-transform: translate(-50%);
        transform: translate(-50%);
        background: #fff;
        z-index: 30;
        padding: 20px;
        border-radius: 10px;
        font-size: 15px;
    }

    .btn_dg__close {
        position: absolute;
        right: 8px;
        top: 6px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #00BCD4;
        line-height: 20px;
        text-align: center;
        color: #fff;
    }
}

.shadow {
    border: 1px solid #ccc;
    background: #fff;
    box-shadow: 0 0 15px 0 #999;
}

.title {
    padding-left: 10px;
}

.page_TM {
    position: relative;
    min-height: 400px;
    border-top: 1px solid #ccc;

    .part_left {
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
        width: 200px;
        height: 100%;
        border-right: 1px solid #ccc;
    }

    .search_unit {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    .btn__search {
        display: inline-block;
        width: 25px;
        height: 25px;
        background: url('./image/search.png') 0 center no-repeat;
        background-size: cover;
        padding: 0;
    }

    .txt__search {
        width: 160px;
        display: inline-block;
    }

    .btn_tm {
        position: absolute;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        width: 160px;
        height: 30px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 30px;
        background: #00BCD4;
        border-radius: 13px;
    }

    .part_right {
        display: inline-block;
        padding-left: 200px;
        width: 100%;

        h3 {
            height: 40px;
            line-height: 40px;
            text-indent: 10px;
        }

        .btn_addmem {
            position: absolute;
            right: 10px;
            top: 5px;
            width: 160px;
            height: 30px;
            font-size: 16px;
            color: #fff;
            text-align: center;
            line-height: 30px;
            background: #00BCD4;
            border-radius: 13px;
        }
    }

    .tab_head {
        width: 400px;

        span {
            position: relative;
            display: inline-block;
            width: 49%;
            height: 45px;
            line-height: 45px;
            text-align: center;
            font-size: 17px;

            &:nth-child(2n+1):after {
                content: " ";
                position: absolute;
                right: 0;
                top: 25%;
                width: 1px;
                height: 50%;
                border-right: 1px solid #e4e4e4;
            }
        }

        .active {
            color: #00BCD4;
        }
    }

    h3 {
        border-bottom: 1px solid #ccc;
    }

    .tab_content {}

    .line_input {
        display: flex;
        line-height: 30px;
        font-size: 16px;
        margin: 5px;
        padding-right: 20px;
        align-items: center;

        label {
            flex-basis: 100px;
            text-align: center;
        }

        input {
            display: inline-block;
            flex: 1;
            text-indent: 5px;
            border-style: none;
            border: 1px solid #ccc;
            border-radius: 5px;
            height: 30px;
        }

        input:focus {
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(0, 0, 0, .6);
        }

        .tip {
            color: #a89e9e;
        }
    }

    .btn_addmem_submit {
        margin: 10px auto 0;
        height: 35px;
        width: 220px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 35px;
        background: #00BCD4;
        border-radius: 13px;
    }

    .block_content {
        display: flex;

        .el-tree {
            flex: 1;
        }

        .area_edit {
            flex: 1;
            border: 1px solid #ccc;
            height: 200px;
            border-radius: 12px;
        }
    }

    /*  */
    .dialog_tm {
        padding: 14px 0 0 20px;
        ;
        height: 300px;
        width: 400px;
        z-index: 999;

        .block_btns {
            position: absolute;
            width: 60px;
            height: 100%;
            top: 0;
            left: -50px;
            z-index: -1;
            display: flex;
            flex-direction: column;

            span {
                display: inline-block;
                flex: 1;
                line-height: 100px;
                font-weight: bold;
                text-align: center;
                background: #ccc;
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
            }

            .btn_add__team {}

            .btn_del__team {}

            .btn_edit__team {}

            .active {
                background: #00BCD4;
                color: #fff;
            }
        }

        section {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            width: 300px;
        }
    }

    .section_delete {
        .el-select {
            margin: 0 auto;
        }

        .btn_addmem_submit {
            margin-top: 20px;
            background: #f30303;
            color: #ffffff;
            font-weight: bold;
        }
    }

    .tip_addemail {
        font-size: 14px;
        text-align: center;
        color: #a56666;
    }

    .btn_delete {
        width: 32px;
        height: 24px;
        background: url('./image/del.png') center center no-repeat;
        background-size: contain;
    }
}
</style>
