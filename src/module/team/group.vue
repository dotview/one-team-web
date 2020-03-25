<template>
    <div style="position: relative;">
        <h1>分组管理</h1>
         <el-button
           icon="el-icon-plus"
           size="medium"
           @click="addGroup"
           class="add">新增</el-button>
        <el-tabs
          v-model="activeName"
          @tab-click="handleTabClick">
            <el-tab-pane
              v-for="(item, index) in teamGroup"
              :key="index"
              :label="item.teamName"
              :name="'' + index"></el-tab-pane>
        </el-tabs>
        <el-input
          class="group-name"
          v-model="groupInfo.teamName"
          placeholder="请输入小组名称"></el-input>
        <div class="group-transfer">
            <el-transfer
              style="text-align: left; display: flex;"
              v-model="value"
              filterable
              :titles="[teamInfo.teamName, groupListName]"
              :button-texts="['到左边', '到右边']"
              @change="handleChange"
              @right-check-change="rightCheckChange"
              :data="generateData">
                <span
                  slot="left-footer"
                  class="group-footer">
                    <span>管理员：</span>
                    <span>{{ userInfo.nickName }}</span>
                    &lt;<span>{{ userInfo.eMail }}</span>&gt;
                </span>
                <span
                  slot="right-footer"
                  class="group-footer">
                    <el-button
                      class="transfer-footer"
                      size="small"
                      @click="setManage">{{manageText}}</el-button>
                    <span>{{manageName}}</span>
                </span>
            </el-transfer>
        </div>
        <el-button
          @click="update"
          class="mt10">保存</el-button>
        <el-button
          @click="deleteTeam"
          class="mt10"
          type="danger"
          v-if="activeName !== 'add'">删除</el-button>
    </div>
</template>
<script>
import {
    Tabs,
    TabPane,
    Transfer
} from 'element-ui'
import {
    getGroups,
    updateTeam,
    deleteTeam
} from '@/api/team'
import { mapState } from 'vuex'

export default {
    name: 'team-group',
    data() {
        return {
            activeName: '0',
            groupInfo: {
                teamName: '',
                memberList: [],
                administrator: '',
                pid: ''
            },
            teamGroup: [],
            teamInfo: {
                teamName: '',
                memberList: []
            },
            value: [],
            rightChecked: [],
            leftChecked: []
        }
    },
    components: {
        'el-transfer': Transfer,
        'el-tabs': Tabs,
        'el-tab-pane': TabPane
    },
    computed: {
        ...mapState({
            userInfo: 'userInfo'
        }),
        groupListName() {
            return this.groupInfo.teamName || '新组'
        },
        generateData() {
            return this.teamInfo.memberList.map((v) => {
                if (!(v._id in this.value)) {
                    return {
                        key: v._id,
                        label: v.nickName + ' <' + v.eMail + '>'
                    }
                }
            })
        },
        manageText() {
            return this.groupInfo.administrator ? '更换组长' : '选为组长'
        },
        manageName() {
            for (let v of this.teamInfo.memberList) {
                if (v._id === this.groupInfo.administrator) {
                    return `${v.nickName} <${v.eMail}>`
                }
            }
            return ''
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            getGroups().then((res) => {
                this.teamInfo = res.teamInfo
                this.teamGroup = res.teamGroup
                if (this.teamGroup.length === 0) {
                    this.addGroup()
                }
                this.handleTabClick()
            }).catch(error => {
                this.$message.error(error.error)
            })
        },
        addGroup() {
            this.activeName = 'add'
            this.groupInfo = {
                teamName: '',
                memberList: [],
                administrator: '',
                pid: ''
            }
            this.value = []
        },
        update(obj) {
            this.groupInfo.memberList = this.value
            this.groupInfo.pid = this.teamInfo._id
            if (!this.groupInfo.teamName) {
                this.$message.error('请输入小组名称')
                return
            }
            if (this.value.length < 1) {
                this.$message.error('请选择小组成员')
                return
            }
            if (!this.groupInfo.administrator) {
                this.$message.error('请选择小组长')
                return
            }
            this.$msgbox({
                title: '提示',
                message: this.inOtherGroupTxt(),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                updateTeam(this.groupInfo).then((res) => {
                    this.$message({
                        message: '信息保存成功',
                        type: 'success'
                    })
                    this.init()
                }).catch(error => {
                    this.$message.error(error.error)
                })
            }).catch(() => {
                this.handleTabClick()
                this.leftChecked = []
            })
        },
        deleteTeam() {
            this.$confirm('确定要删除该小组吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteTeam({ _id: this.teamGroup[this.activeName]._id }).then((res) => {
                    this.$message({
                        message: '小组删除成功',
                        type: 'success'
                    })
                    this.init()
                }).catch(error => {
                    this.$message.error(error.error)
                })
            })
        },
        handleChange(value, direction, movedKeys) {
            this.leftChecked = movedKeys
        },
        handleTabClick() {
            this.groupInfo = {...this.teamGroup[this.activeName]}
            this.value = this.teamGroup[this.activeName].memberList.map(v => v._id)
        },
        rightCheckChange(key) {
            this.rightChecked = key
        },
        setManage() {
            if (this.rightChecked.length !== 1) {
                this.$message.error('请选择 1 位组长')
                return
            }
            this.groupInfo.administrator = this.rightChecked[0]
        },
        inOtherGroupTxt() {
            const h = this.$createElement
            let targets = []
            let text = []
            this.teamGroup.map(item => {
                let target = {
                    nickName: '',
                    groupName: ''
                }
                item.memberList.map(data => {
                    if (this.leftChecked.includes(data._id)) {
                        target.nickName += data.nickName + '、'
                    }
                })
                if (target.nickName.length !== 0) {
                    target.groupName = item.teamName
                    targets.push(target)
                }
            })
            text = targets.map(data => h('p', null, `成员【${data.nickName.replace(/、$/, '')}】已在【${data.groupName}】小组中`))
            if (text.length !== 0) {
                text.push(h('br'))
            }
            text.push(h('p', null, '确定要调整分组吗？'))
            return h('p', null, text)
        }
    }
}
</script>
<style lang="scss" scoped>

.add {
    position: absolute;
    right: 0;
    top: 5px;
}

/deep/ .el-transfer-panel {
    width: 400px;
}

/deep/ .el-transfer {
    justify-content: space-between;
    align-items: center;
}

/deep/ .el-transfer-panel__body {
    height: 286px;
}

.group-transfer {
    text-align: center;
    margin-top: 20px;
}

.group-name {
    margin-top: 10px;
}

.group-footer {
    margin-left: 15px;
}

.transfer-footer {
    padding: 6px 5px;
    margin-right: 10px;
}

.mt10 {
    margin-top: 10px;
}
</style>
