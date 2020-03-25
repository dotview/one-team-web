<template>
    <el-menu
      class="report-nav"
      :default-active="defaultActive"
      :default-openeds="defaultGroups"
      :unique-opened="true"
      @open="handleOpen">
        <el-submenu
          v-for="(group, groupIndex) in teamList"
          :key="groupIndex"
          :index="group._id">
            <template slot="title">
                <span>{{group.teamName}}</span>
            </template>
            <el-menu-item
              v-for="(item, index) in group.memberList"
              :key="index"
              :index="groupIndex + '-' + index"
              :disabled="notWritten.some(data => data._id === item._id)"
              @click="goLink(item._id)">
                {{item.nickName}}
            </el-menu-item>
        </el-submenu>
        <el-submenu :index="userInfo.teamId">
            <template slot="title">
                <span>所有</span>
            </template>
        </el-submenu>
    </el-menu>
</template>
<script>
import {
    Menu,
    Submenu,
    MenuItem
} from 'element-ui'
import { mapState } from 'vuex'
export default {
    name: 'reportNav',
    props: {
        teamList: {
            type: Array,
            default: () => {
                return []
            }
        },
        notWritten: {
            type: Array,
            default: () => {
                return []
            }
        },
        defaultGroups: {
            type: Array,
            default: () => {
                return ''
            }
        }
    },
    data() {
        return {
            defaultActive: '0'
        }
    },
    computed: {
        ...mapState({
            userInfo: 'userInfo'
        })
    },
    components: {
        'el-menu': Menu,
        'el-submenu': Submenu,
        'el-menu-item': MenuItem
    },
    methods: {
        handleOpen(key, keyPath) {
            this.$store.commit('SET_NEW_GROUPID', {groupId: key})
            this.$emit('handleChange', key)
        },
        goLink(id) {
            if (this.notWritten.some(data => data._id === id)) {
                return
            }
            this.$emit('handleLink', id)
        }
    }
}
</script>
<style lang="scss" scoped>
.report-nav {
    min-width: 150px;
    max-height: 100%;
}
.el-menu-item {
    min-width: 150px;
}
/deep/ .el-submenu__title {
    background: #fff;
}
/deep/ .el-submenu__title:hover {
    background: #ecf5ff;
}
</style>
