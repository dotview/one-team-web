import md5 from 'js-md5'
import Base64 from '../js/base64'

export const encrypt = (data) => {
    var hash = md5.create()
    hash.update(data)
    return hash.hex()
}

export const decodeBase64 = (str) => {
    return Base64.decode(str)
}

export const login = (param) => {
    let url = window.location.pathname + window.location.search
    if (param) {
        url = param
    }
    window.location.href = '/page/user/login?backUrl=' + encodeURIComponent(url)
}
