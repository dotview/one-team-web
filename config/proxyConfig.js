const routerLocal = {
    'test:8080': 'http://192.168.4.28:18006',
    'prod:8080': 'http://192.168.4.28:8006'
}

if (process.env.NODE_ENV !== 'production') {
    console.log('********************** HOST添加配置 ***********************\n')
    console.log('127.0.0.1', 'test prod')
    console.log('***********************************************************')
}
module.exports = {
    proxy: {
        '/+(api|user|team|week|common)/**': {
            // target: 'http://172.16.19.191:8081/',
            logLevel: 'debug',
            target: process.env.TARGET || 'http://localhost:8081/',
            changeOrigin: true, //是否跨域
            pathRewrite: {}, //需要rewrite的
            // cookieDomainRewrite: cookieLocal,
            router: routerLocal
        }
    }
}
