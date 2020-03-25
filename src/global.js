import { _getPromise, _postPromise, _putPromise, _patchPromise, _deletePromise } from '@/api/base'

export const install = function(Vue, config = {}) {
    Vue.config.productionTip = false
    Vue.config.devtools = process.env.NODE_ENV !== 'production'
    Vue.prototype.$_get = _getPromise
    Vue.prototype.$_post = _postPromise
    Vue.prototype.$_put = _putPromise
    Vue.prototype.$_patch = _patchPromise
    Vue.prototype.$_delete = _deletePromise
}
