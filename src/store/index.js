import Vue from 'vue'
import Vuex from 'vuex'
import { _getPromise } from '@/api/base'
import { API_USER } from '@/api'
import { getGroups } from '@/api/team'

Vue.use(Vuex)

const state = {
    userInfo: {},
    teamGroup: [],
    teamInfo: [],
    groupId: '',
    color: '#409EFF',
    keepAliveName: [],
    okrPermission: false
}

const actions = {
    loadUserInfo({ commit }) {
        return new Promise((resolve, reject) => {
            _getPromise(API_USER).then(res => {
                if (res) {
                    commit('SET_USER_INFO', {
                        userInfo: res
                    })
                    resolve(res)
                } else {
                    reject(new Error('接口出错了！'))
                }
            })
        })
    },
    loadTeamInfo({ commit }) {
        return new Promise((resolve, reject) => {
            getGroups().then(res => {
                if (res) {
                    commit('SET_TEAM_INFO', {
                        teamGroup: res.teamGroup,
                        teamInfo: res.teamInfo.memberList
                    })
                    resolve(res)
                } else {
                    reject(new Error('接口出错了！'))
                }
            })
        })
    }
}

const mutations = {
    SET_USER_INFO: (state, { userInfo }) => {
        state.userInfo = userInfo
    },
    SET_NEW_GROUPID: (state, { groupId }) => {
        state.groupId = groupId
    },
    SET_KEEP_ALIVE: (state, name) => {
        state.keepAliveName = name
    },
    SET_TEAM_INFO: (state, { teamGroup, teamInfo }) => {
        state.teamGroup = teamGroup
        state.teamInfo = teamInfo
    },
    SET_OKR_PERMISSION: (state, bool) => {
        state.okrPermission = bool
    }
}

const getters = {}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
