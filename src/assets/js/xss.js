import xss from 'xss'

// 自定义过滤规则
let options = {
    escapeHtml: function(html) {
        return html
    }
}

let coustomXss = new xss.FilterXSS(options)

export default coustomXss
