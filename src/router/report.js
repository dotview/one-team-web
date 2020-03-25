/* beautify preserve:start */
const reportList = () => import(/* webpackChunkName: 'report_list' */ '../module/report/list')
const reportDetail = () => import(/* webpackChunkName: 'report_detail' */ '../module/report/add')
const reportConfig = () => import(/* webpackChunkName: 'report_config' */ '../module/report/config')
const Index = () => import(/* webpackChunkName: 'index' */ '../module/home/index')
/* beautify preserve:end */

export default [{
    path: '/page',
    component: Index,
    children: [{
        path: 'reportList',
        component: reportList,
        name: 'reportList',
        meta: {
            title: '汇报 | one-team'
        }
    }, {
        path: 'reportDetail',
        component: reportDetail,
        name: 'reportDetail',
        meta: {
            title: '汇报 | one-team'
        }
    }, {
        path: 'reportConfig',
        component: reportConfig,
        name: 'reportConfig',
        meta: {
            title: '汇报 | one-team'
        }
    }]
}]
