/* beautify preserve:start */
const okrList = () => import(/* webpackChunkName: 'okr_list' */ '../module/okr/list')
const okrDetail = () => import(/* webpackChunkName: 'okr_detail' */ '../module/okr/detail')
const Index = () => import(/* webpackChunkName: 'index' */ '../module/home/index')
/* beautify preserve:end */

export default [{
    path: '/page',
    component: Index,
    children: [{
        path: 'okrList',
        component: okrList,
        name: 'okrList',
        meta: {
            title: 'OKR | one-team'
        }
    }, {
        path: 'okrDetail/:id?',
        component: okrDetail,
        name: 'okrDetail',
        meta: {
            title: 'OKR | one-team'
        }
    }]
}]
