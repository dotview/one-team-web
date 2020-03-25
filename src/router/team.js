const teamList = () => import(/* webpackChunkName: 'team_list' */ '../module/team/list')
const teamJoin = () => import(/* webpackChunkName: 'team_join' */ '../module/team/join')
const teamGroup = () => import(/* webpackChunkName: 'team_tree' */ '../module/team/group')
const teamTree = () => import(/* webpackChunkName: 'team_tree' */ '../module/team/tree')
const teamDashBoard = () => import(/* webpackChunkName: 'team_dashboard' */ '../module/team/dashboard')
const Index = () => import(/* webpackChunkName: 'index' */ '../module/home/index')

export default [{
    path: '/page',
    component: Index,
    children: [{
        path: 'teamList',
        component: teamList,
        name: 'teamList',
        meta: {
            title: '团队 | one-team'
        }
    }, {
        path: 'teamManage',
        component: teamTree,
        name: 'teamTree',
        meta: {
            title: 'teamTree',
            inDefault: true
        }
    }, {
        path: 'teamJoin',
        component: teamJoin,
        name: 'teamJoin',
        meta: {
            title: '团队 | one-team'
        }
    }, {
        path: 'teamDashBoard',
        component: teamDashBoard,
        name: 'teamDashBoard',
        meta: {
            title: '团队 | one-team'
        }
    }, {
        path: 'group',
        component: teamGroup,
        name: 'teamGroup',
        meta: {
            title: '团队 | one-team'
        }
    }]
}]
