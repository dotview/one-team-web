<template>
    <div class="refuse-page">
        <el-alert title="您还未加入任何团队"
            type="warning">
        </el-alert>
        <el-tabs v-model="activeName"
            class="refuse-content">
            <el-tab-pane label="创建团队"
                name="teamName">
                <el-input v-model="teamName"
                    placeholder="请输入团队名称"></el-input>
            </el-tab-pane>
            <el-tab-pane label="加入团队"
                name="teamId">
                <el-input v-model="teamId"
                    placeholder="请输入邀请码"></el-input>
            </el-tab-pane>
        </el-tabs>
        <el-button type="primary"
            @click="submit">下一步</el-button>
    </div>
</template>
<script>
import {
    Tabs,
    TabPane
} from 'element-ui'
import {
    addMembers
} from '@/api/team'
export default {
    name: 'home',
    data() {
        return {
            activeName: 'teamName',
            teamName: '',
            teamId: ''
        }
    },
    computed: {
        placeholder() {
            return this.opera === 'create' ? '请输入团队名称' : '请输入团队邀请码'
        }
    },
    components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane
    },
    mounted() {},
    methods: {
        submit() {
            if (!this[this.activeName]) {
                let msg = ({
                    teamName: '请输入团队名称',
                    teamId: '请输入团队邀请码'
                })[this.activeName]
                this.$message.error(msg)
                return
            }
            let form = {}
            form[this.activeName] = this[this.activeName]
            addMembers(form).then((res) => {
                this.$router.replace({
                    name: 'home'
                })
            }).catch(error => {
                this.$message.error(error)
            })
        }
    }
}
</script>
<style lang="scss"
    scoped>
.refuse-content {
    margin-bottom: 20px;
}
</style>
