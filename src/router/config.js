import home from './home'
import user from './user'
import report from './report'
import team from './team'
import login from './login'
import error from './error'
import forum from './forum'
import okr from './okr'
import App from '../module/index'

export default [{
    path: '/',
    component: App,
    redirect: '/page/home',
    children: [
        ...error,
        ...login,
        ...home,
        ...user,
        ...report,
        ...team,
        ...forum,
        ...okr
    ]
}, {
    path: '*',
    redirect: '/404'
}]
