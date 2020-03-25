<template>
    <div>
        <div v-if="!loading && !refuse">
            <div class="hd">
                <div class="hd-name">
                    <h1 class="title">{{teamName}}</h1>
                    <span class="invate">邀请码：{{code}}</span>
                </div>
                <div>
                    <el-button size="small"
                        v-if="isAdmin"
                        @click="manageGroup">管理分组</el-button>
                    <el-button size="small"
                        v-if="isAdmin"
                        @click="invate">邀请新成员</el-button>
                    <el-button size="small"
                        @click="teamOpera('out')">退出团队</el-button>
                </div>
            </div>
            <div class="team-group">
                <el-button
                  v-for="(item, index) in teamGroup"
                  :class="{'group-focus': item._id === type}"
                  :key="index"
                  size="mini"
                  type="info"
                  @click="getGroup(item._id)">{{item.teamName}}
                </el-button>
                <el-button
                  :class="{'group-focus': type === 'team'}"
                  size="mini"
                  type="info"
                  @click="initData()">全部成员</el-button>
                <el-input
                  v-model="content"
                  clearable
                  class="search-input"
                  placeholder="输入成员姓名进行搜索"
                  prefix-icon="el-icon-search"
                  size="medium"
                  @keyup.enter.native="search">
                </el-input>
            </div>
            <el-table
              :data="tableData"
              style="width: 100%">
                <el-table-column label="成员">
                    <template slot-scope="scope">
                        <div class="cell-hd">
                            <router-link :to="{name: 'personalCenter', params: {userId: scope.row._id}}">
                                <avator :src="scope.row.headPortrait" size="14px" :placeholder="scope.row.nickName" />
                            </router-link>
                            <span style="margin-left: 20px;">{{ scope.row.nickName }}</span>
                            <span class="admin" v-if="scope.row._id == administrator">管理员</span>
                            <span class="admin white" v-if="scope.row.white">白名单</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                  label="邮箱"
                  prop="eMail"></el-table-column>
                <el-table-column
                  width="150"
                  label="联系方式"
                  prop="phoneNumber"></el-table-column>
                <el-table-column
                  width="290"
                  label="操作"
                  v-if="isAdmin && type === 'team'">
                    <template slot-scope="scope">
                        <el-button
                          size="mini"
                          @click="teamOpera('white', scope.row._id, scope.row.white)">{{ !scope.row.white ? '加入白名单' : '移出白名单' }}</el-button>
                        <el-button
                          size="mini"
                          v-if="administrator !== scope.row._id"
                          @click="teamOpera('admin', scope.row._id)">移交权限</el-button>
                        <el-button
                          size="mini"
                          type="danger"
                          v-if="administrator !== scope.row._id"
                          @click="teamOpera('del', scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <refuse v-if="refuse"></refuse>
    </div>
</template>
<script>
import {
    Table,
    TableColumn
} from 'element-ui'
import {
    getMembers,
    updateMembers
} from '@/api/team'
import refuse from '@/module/common/refuse'
import avator from 'components/avator'

export default {
    name: 'home',
    data() {
        return {
            refuse: false,
            loading: true,
            isAdmin: false,
            administrator: '',
            tableData: [],
            tempData: [],
            teamGroup: [],
            teamName: '',
            code: '',
            type: '',
            content: ''
        }
    },
    components: {
        refuse,
        'el-table': Table,
        'el-table-column': TableColumn,
        avator
    },
    computed: {
        manageText() {
            return this.managing ? '完成' : '管理团队'
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            getMembers().then((res) => {
                this.type = 'team'
                this.teamName = res.teamName
                this.code = res._id
                this.administrator = res.administrator
                this.isAdmin = res.isAdmin
                this.tableData = res.memberList
                this.teamGroup = res.teamGroup
                this.tempData = [...res.memberList]
                this.loading = false
            }).catch(error => {
                this.$message.error(error.error)
                this.refuse = true
            })
        },
        search(e) {
            let value = e.target.value
            if (!value) {
                this.tableData = this.tempData
                return
            }
            const patt = new RegExp(`${value}`)
            this.tableData = this.tempData.filter(data => patt.test(data.nickName))
        },
        invate() {
            this.$router.push({ name: 'teamJoin' })
        },
        manageGroup() {
            this.$router.push({ name: 'teamGroup' })
        },
        manageAction() {
            this.$router.push({
                path: 'teamManage'
            })
        },
        teamOpera(str, id = this.$store.state.userInfo._id, white) {
            if (str === 'out' && this.isAdmin) {
                this.$message.error('请先移交管理权限')
                return
            }
            let tips = ''
            switch (str) {
            case 'del':
                tips = '确定要删除该成员吗？'
                break
            case 'out':
                tips = '确定要退出该团队吗？'
                break
            case 'admin':
                tips = '确定要移交出该成员的权限吗？'
                break
            case 'white':
                tips = !white ? '加入白名单后将不会收到周报提醒邮件，确定将该成员加入吗？' : '确定要将该成员移出白名单吗？'
                break
            }
            this.$confirm(tips, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateMembers({
                    opera: str,
                    userId: id
                }).then((res) => {
                    this.$message.success('操作成功！')
                    this.initData()
                }).catch(error => {
                    this.$message.error(error.error)
                })
            }).catch(() => {})
        },
        getGroup(teamId) {
            this.type = teamId
            getMembers({ teamId }).then((res) => {
                this.tableData = res.memberList
                this.tempData = [...res.memberList]
            }).catch(error => {
                this.$message.error(error.error)
                this.refuse = true
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/base.scss';

h1 {
    display: inline-block;
    font-size: 28px;
}

.hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.team-group {
    position: relative;
    margin-bottom: 5px;
}

.search-input {
    width: 250px;
    position: absolute;
    right: 0;
    top: -5px;
}

.group-focus {
    background: #409eff;
    border-color: #409eff;
}

.title {
    color: #333;
    margin-right: 10px;
}

.invate {
    padding: 5px 15px;
    border-radius: 20px;
    background-color: #ecf5ff;
    display: inline-block;
}

.admin {
    font-size: 12px;
    margin-left: 5px;
    padding: 2px 10px;
    border-radius: 20px;
    background-color: #fcf1a5;
    display: inline-block;
    &.white {
        background-color: #c0c4cc;
        color: #fff;
    }
}

.cell-hd {
    display: flex;
    align-items: center;
}
</style>
