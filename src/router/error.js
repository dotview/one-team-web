const NotFound = () => import(/* webpackChunkName: 'refuse' */ '../module/error/404')

export default [{
    path: '/404',
    name: 'notFound',
    component: NotFound,
    meta: {
        title: '404 Not Found'
    }
}]
