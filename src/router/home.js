const Refuse = () => import(/* webpackChunkName: 'refuse' */ '../module/common/refuse')
const Home = () => import(/* webpackChunkName: 'index' */ '../module/home/home')
const Index = () => import(/* webpackChunkName: 'index' */ '../module/home/index')

export default [{
    path: '/page',
    component: Index,
    children: [{
        path: 'home',
        name: 'home',
        component: Home,
        meta: {
            title: '首页 | one-team'
        }
    }, {
        path: 'refuse',
        name: 'refuse',
        component: Refuse,
        meta: {
            title: '未加入团队 | one-team'
        }
    }]
}]
