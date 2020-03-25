/* beautify preserve:start */
const forumList = () => import(/* webpackChunkName: 'report_list' */ '../module/forum/list')
const forumEdit = () => import(/* webpackChunkName: 'report_detail' */ '../module/forum/edit')
const forumDetail = () => import(/* webpackChunkName: 'report_detail' */ '../module/forum/detail')
const Index = () => import(/* webpackChunkName: 'index' */ '../module/home/index')
/* beautify preserve:end */

export default [{
    path: '/page',
    component: Index,
    children: [{
        path: 'forumList',
        component: forumList,
        name: 'forumList',
        meta: {
            title: '分享 | one-team'
        }
    }, {
        path: 'forumDetail/:forumId',
        component: forumDetail,
        name: 'forumDetail',
        meta: {
            title: '分享 | one-team'
        }
    }, {
        path: 'forumEdit',
        component: forumEdit,
        name: 'forumEdit',
        meta: {
            title: '分享 | one-team'
        }
    }]
}]
