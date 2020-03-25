/* beautify preserve:start */
const Settings = () => import(/* webpackChunkName: 'user_settings' */ '../module/user/settings/index')
const Myhome = () => import(/* webpackChunkName: 'user_myhome' */ '../module/user/center/myhome')
const Index = () => import(/* webpackChunkName: 'index' */ '../module/home/index')
/* beautify preserve:end */

export default [{
    path: '/page',
    component: Index,
    children: [{
        path: 'user/settings',
        name: 'settings',
        component: Settings,
        meta: {
            title: '我自己 | one-team'
        }
    }, {
        path: 'user/center/:userId',
        name: 'personalCenter',
        component: Myhome,
        meta: {
            title: '我自己 | one-team'
        }
    }]
}]
