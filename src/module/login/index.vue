<template>
    <div class="one-team_login" id="login" >
        <div id="container" class="container">
            <div id="output"></div>
        </div>
        <div class="login-wrapper">
            <img :src="logo" alt="oneTeam" class="logo">
            <h1>One Team</h1>
            <div class="login-content">
                <router-view></router-view>
            </div>
        </div>
        <div class="login-tip">
            <h2 style="margin-bottom: 35px;">One Team是一个填写周报、管理OKR、发表分享的团队协作系统。</h2>
            <h2>“用One Team，你和你的团队会变得更优秀！”</h2>
            <h3>- OneTeam</h3>
        </div>
    </div>
</template>
<script>
export default {
    name: 'user',
    data() {
        return {
            logo: require('@/assets/icon/logo1.png')
        }
    },
    mounted() {
        // 渲染登录页背景动画图
        this.$FSS('container', 'output')
    }
}
</script>
<style lang='scss' scoped>
.one-team_login {
    background-color: #409EFF;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1600;
}
.container {
    position: absolute;
    height: 100%;
    width: 100%;
}
#output {
    opacity: 0.3;
    width: 100%;
    height: 100%;
    transition: all 400ms ease-in-out;
}
.login-wrapper {
    width: 400px;
    min-height: 440px;
    padding: 40px 0;
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-100%);
    background: #fff;
    border-radius: 6px;
    border: 1px solid #e3e3e3;
    box-shadow: 0 12px 16px 0 rgba(0,0,0,.12);
    h1 {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 30px;
    }
}
.login-content {
    width: 310px;
    margin: 0 auto;
}
.logo {
    position: absolute;
    width: 150px;
    top: -90px;
    left: 50%;
    transform: translateX(-50%);
}
.login-tip {
    color: #fff;
    position: absolute;
    width: 500px;
    left: 52%;
    top: 20%;
    h3 {
        opacity: .7
    }
}
</style>
