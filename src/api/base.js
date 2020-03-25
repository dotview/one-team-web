import axios from 'axios'
import { Loading, Message } from 'element-ui'

const formatRes = (res) => {
    if (res.success) {
        return Promise.resolve(res.result)
    }
    if (res.status === 'success') {
        return Promise.resolve(res.data)
    }
    let url = window.location.href
    if (res.code === '-1999') {
        window.location.replace('/page/user/login?url=' + encodeURIComponent(url))
        return false
    }
    return Promise.reject(res)
}
let loadingObj = null
const showLoading = (extend) => {
    if (extend.loading) {
        loadingObj = Loading.service({
            lock: true,
            target: document.getElementsByClassName('one-team')[0],
            text: '拼命加载中...',
            background: 'hsla(0,0%,100%,0)'
        })
    }
}

const hideLoading = (extend) => {
    if (extend.loading) {
        loadingObj && loadingObj.close()
    }
}
// add header
axios.interceptors.request.use((config) => {
    config.withCredentials = true
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}, (error) => {
    return Promise.reject(error)
})

// format response
axios.interceptors.response.use((response) => {
    return formatRes(response.data)
})

export const _getPromise = (url, data = {}, extend = {}) => {
    if (loadingObj && loadingObj.visible) {
        hideLoading(extend)
    }
    showLoading(extend)
    return axios.get(url, { params: data }).then(response => {
        hideLoading(extend)
        return Promise.resolve(response)
    }).catch((error) => {
        hideLoading(extend)
        Message({
            showClose: true,
            message: '出错了！！',
            type: 'error'
        })
        return Promise.reject(error)
    })
}

export const _postPromise = (url, data = {}) => {
    return axios.post(url, data).then(response => {
        return Promise.resolve(response)
    }).catch((error) => {
        return Promise.reject(error)
    })
}

export const _putPromise = (url, data = {}) => {
    return axios.put(url, data).then(response => {
        return Promise.resolve(response)
    }).catch((error) => {
        return Promise.reject(error)
    })
}

export const _patchPromise = (url, data = {}) => {
    return axios.patch(url, data).then(response => {
        return Promise.resolve(response)
    }).catch((error) => {
        return Promise.reject(error)
    })
}

export const _deletePromise = (url, data = {}) => {
    return axios.delete(url, { params: data }).then(response => {
        return Promise.resolve(response)
    }).catch((error) => {
        return Promise.reject(error)
    })
}
