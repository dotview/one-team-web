/* beautify preserve:start */
const Login = () => import(/* webpackChunkName: 'user_login' */ '../module/login/login')
const Register = () => import(/* webpackChunkName: 'user_register' */ '../module/login/register')
const Reset = () => import(/* webpackChunkName: 'user_passwordReset' */ '../module/login/reset')
const Index = () => import(/* webpackChunkName: 'user_passwordReset' */ '../module/login/index')
/* beautify preserve:end */

export default [{
    path: '/login',
    component: Index,
    children: [{
        path: '',
        name: 'login',
        component: Login,
        meta: {
            title: '登录 | one-team'
        }
    }, {
        path: 'register',
        name: 'register',
        component: Register,
        meta: {
            title: '注册 | one-team'
        }
    }, {
        path: 'reset',
        name: 'reset',
        component: Reset,
        meta: {
            title: '找回密码 | one-team'
        }
    }]
}]
