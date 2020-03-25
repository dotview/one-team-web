export const cookie = {
    get(name) {
        let arr = document.cookie.split('; ')
        let res = ''
        arr.forEach((item) => {
            let arrName = item.split('=')
            if (arrName[0] === name) {
                res = arrName[1]
            }
        })
        return res
    },
    set(name, value, expires, path) {
        var d = new Date()
        d.setTime(d.getTime() + expires)
        document.cookie = name + '=' + value + '; expires=' + d.toUTCString() + '; path=' + path
    },
    clear(name, path) {
        this.set(name, '', -1, path)
    }
}
