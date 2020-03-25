import {
    _getPromise,
    _postPromise,
    _putPromise,
    _deletePromise
} from './base'

/* ================团队================= */
// 获得团队成员
export const getMembers = (param = null) => {
    return _getPromise('/api/v1/team/members', param)
}

// 更新团队成员
export const updateMembers = (param) => {
    return _putPromise('/api/v1/team/members', param)
}

// 加入团队
export const addMembers = (param) => {
    return _postPromise('/api/v1/team/members', param)
}

// 团队邀请链接
export const joinUrl = () => {
    return _getPromise('/api/v1/team/joinUrl')
}

// 发送邮件
export const sendEmail = (param) => {
    return _postPromise('/api/v1/email/team', param)
}

// 删除团队
export const deleteTeam = (param) => {
    return _deletePromise('/api/v1/team/team', param)
}

// 更新团队信息
export const updateTeam = (param) => {
    return _postPromise('/api/v1/team/team', param)
}
// 获取组信息
export const getGroups = () => {
    return _getPromise('/api/v1/team/groups')
}
/* new */
export const getTeamList = (param) => {
    return _getPromise('/api/team/getTeamList', param)
}

export const getPermissionTeamList = (param) => {
    return _postPromise('/api/team/getPermissionTeamList', param)
}

export const createTeam = (param) => {
    return _postPromise('/api/team/team', param)
}

export const addMem2Team = (param) => {
    return _postPromise('/api/team/mem2Team', param)
}

export const getChildTeamInfo = (param) => {
    return _getPromise('/api/team/getChildTeamInfo', param)
}
