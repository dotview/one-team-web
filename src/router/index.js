import Vue from 'vue'
import VueRouter from 'vue-router'
import routerConfig from './config'
import { cookie } from '@/assets/js/cookie'
import jwt from 'jsonwebtoken'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: routerConfig,
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'one team'

    let token = cookie.get('token')
    const secret = 'jwt one'
    let decoded = null
    if (token) {
        decoded = jwt.verify(token, secret, function(err, decoded) {
            return err || decoded
        })
    } else {
        if (to.path === '/login') {
            next()
        } else {
            next('/login')
        }
    }

    if (decoded) {
        if (decoded.exp - Date.now() < 0) { // 已过期
            cookie.clear('token', '/')
            cookie.clear('name', '/')
        } else {
            decoded.exp = Date.now() + 60 * 60 * 1000 * 24
            token = jwt.sign(decoded, secret)
            cookie.set('token', token, decoded.exp, '/')
        }
    }
    next()
    // if (to.path === '/') {
    //     console.log('shen1212123')
    //     if (token) {
    //         next('/page/home')
    //     } else {
    //         next('/login')
    //     }
    // } else {
    //     console.log('next1212')
    //     next()
    // }
})

export default router
