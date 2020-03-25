export const scrollSmooth = element => {
    let mainEl = document.querySelector(element)
    console.log(mainEl)
    let scrollTop = mainEl.scrollTop
    let timer = null
    cancelAnimationFrame(timer)
    timer = requestAnimationFrame(function fn() {
        if (scrollTop > 5000) {
            scrollTop -= 1000
            mainEl.scrollTop = scrollTop
            timer = requestAnimationFrame(fn)
        } else if (scrollTop > 1000 && scrollTop <= 5000) {
            scrollTop -= 500
            mainEl.scrollTop = scrollTop
            timer = requestAnimationFrame(fn)
        } else if (scrollTop > 200 && scrollTop <= 1000) {
            scrollTop -= 100
            mainEl.scrollTop = scrollTop
            timer = requestAnimationFrame(fn)
        } else if (scrollTop > 50 && scrollTop <= 200) {
            scrollTop -= 10
            mainEl.scrollTop = scrollTop
            timer = requestAnimationFrame(fn)
        } else if (scrollTop > 0 && scrollTop <= 50) {
            scrollTop -= 5
            mainEl.scrollTop = scrollTop
            timer = requestAnimationFrame(fn)
        } else {
            cancelAnimationFrame(timer)
        }
    })
}

export const scrollUnique = element => {
    let target = document.querySelector(element)
    if (navigator.userAgent.indexOf('Firefox') > 0) {
        target.addEventListener('DOMMouseScroll', function(event) {
            handleScroll(target, event)
        }, false)
    } else {
        target.onmousewheel = function(event) {
            handleScroll(target, event)
        }
    }
}

function handleScroll(t, e) {
    let scrollTop = t.scrollTop
    let scrollHeight = t.scrollHeight
    let height = t.clientHeight

    let delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0)

    if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
        // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
        t.scrollTop = delta > 0 ? 0 : scrollHeight
        // 向上滚 || 向下滚
        e.preventDefault()
    }
}
