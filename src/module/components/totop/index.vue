<template>
  <transition name='scroll-animate'>
    <div class='page-up' @click='scrollToTop' v-show='toTopShow'>
      <i class='el-icon-caret-top'></i>
    </div>
  </transition>
</template>

<script>
export default {
    props: {
        container: {
            type: String,
            defaults: 'body'
        }
    },
    data() {
        return {
            scrollTop: 0,
            toTopShow: false,
            mainEl: ''
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.mainEl = document.querySelector(this.container)
            this.mainEl.addEventListener('scroll', this.handleScroll, true)
        })
    },
    destroyed() {
        this.mainEl.addEventListener('scroll', this.handleScroll, true)
    },
    methods: {
        handleScroll() {
            this.scrollTop = this.mainEl.scrollTop
            if (this.scrollTop > 250) {
                this.toTopShow = true
            } else {
                this.toTopShow = false
            }
        },
        scrollToTop() {
            let timer = null
            let _this = this
            cancelAnimationFrame(timer)
            timer = requestAnimationFrame(function fn() {
                if (_this.scrollTop > 5000) {
                    _this.scrollTop -= 1000
                    _this.mainEl.scrollTop = _this.scrollTop
                    timer = requestAnimationFrame(fn)
                } else if (_this.scrollTop > 1000 && _this.scrollTop <= 5000) {
                    _this.scrollTop -= 500
                    _this.mainEl.scrollTop = _this.scrollTop
                    timer = requestAnimationFrame(fn)
                } else if (_this.scrollTop > 200 && _this.scrollTop <= 1000) {
                    _this.scrollTop -= 100
                    _this.mainEl.scrollTop = _this.scrollTop
                    timer = requestAnimationFrame(fn)
                } else if (_this.scrollTop > 50 && _this.scrollTop <= 200) {
                    _this.scrollTop -= 10
                    _this.mainEl.scrollTop = _this.scrollTop
                    timer = requestAnimationFrame(fn)
                } else if (_this.scrollTop > 0 && _this.scrollTop <= 50) {
                    _this.scrollTop -= 5
                    _this.mainEl.scrollTop = _this.scrollTop
                    timer = requestAnimationFrame(fn)
                } else {
                    cancelAnimationFrame(timer)
                    _this.toTopShow = false
                }
            })
            // this.mainEl.scrollTo({top: 0, behavior: 'smooth'})
        }
    }
}
</script>

<style scoped lang='scss'>
  .page-up{
    background-color: #409eff;
    position: fixed;
    right: 150px;
    bottom: 150px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    cursor: pointer;
    transition: .3s;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .5);
    opacity: .5;
    z-index: 100;
    .el-icon-caret-top{
      color: #fff;
      display: block;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
    }
    p{
      display: none;
      text-align: center;
      color: #fff;
    }
    &:hover{
      opacity: 1;
    }
  }
    @keyframes fadeOutUp {
        0% {
            opacity: .5;
            transform: translateY(0)
        }
        100% {
            opacity: 0;
            transform: translateY(-40px)
        }
    }
    @keyframes fadeInDown {
        0% {
            opacity: 0;
            transform: translateY(-40px)
        }
        100% {
            opacity: .5;
            transform: translateY(0)
        }
    }
    .scroll-animate-enter-active {
        animation: fadeInDown .4s ease;
    }
    .scroll-animate-leave-active {
        animation: fadeOutUp .4s ease;
    }
</style>
