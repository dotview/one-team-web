<!--
 * @Description: 主页面
 * @Author: 沈浩
 * @Date: 2019-01-30 17:37:28
 * @LastEditTime: 2019-08-16 13:50:55
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div class="one-team_home" v-if="show">
        <page-header />
        <div class="one-team_main" v-infinite-scroll="load" infinite-scroll-immediate="false" style="overflow: auto;">
            <div class="one-team_content">
                <keep-alive :include="$store.state.keepAliveName">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <scroll-top container=".one-team_main" />
    </div>
</template>
<script>
import pageHeader from 'components/header'
import scrollTop from 'components/totop'

export default {
    name: 'home',
    components: {
        pageHeader,
        scrollTop
    },
    data() {
        return {
            show: false
        }
    },
    created() {
        Promise.all([
            this.$store.dispatch('loadTeamInfo'),
            this.$store.dispatch('loadUserInfo')
        ]).then(res => {
            if (res[0] && res[1]) {
                this.show = true
            }
        })
    },
    methods: {
        load() {
            this.bus.$emit('emitEvent')
        }
    }
}
</script>
<style lang="scss">
@import "simplemde/dist/simplemde.min.css";
.one-team_home {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f2f2f2;
    overflow: hidden;
}
.one-team_main {
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40px 0;
    // overflow-y: overlay;
    overflow-x: hidden;
}
.one-team_content {
    width: 960px;
    min-height: 100%;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
}
</style>
