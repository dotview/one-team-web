<template>
    <div class="hello_home" id="home">
        <div class="hello">
            <!-- <h3>Hello, {{nickName}} :）</h3> -->
            <!-- <h2>Even if it's the end of the world, I'll be there for you</h2> -->
            <h3>2019</h3>
            <h2>Work Makes Me Happy</h2>
        </div>
        <div class="ft">
            <div class="image">
                <img src="./image/left-pop.png" alt="" ref="imgLeft">
                <img src="./image/bg.png" alt="">
                <img src="./image/right-pop.png" alt="" ref="imgRight">
            </div>
            <div class="sub">
            </div>
        </div>
        <canvas class="firework"></canvas>
    </div>
</template>
<script>
// import { firework } from 'assets/js/firework.js'
export default {
    name: 'home',
    data() {
        return {
            nickName: ''
        }
    },
    mounted() {
        // 烟花
        // firework('.firework', '.hello_home')
    }
}
</script>
<style lang='scss' scoped>
.hello_home {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    overflow: hidden;
    z-index: 1000;
}

.hello {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 100px;
    z-index: 1;
    text-align: center; // margin: 120px auto;
    color: #56332f;
    font-size: 20px;
    h3 {
        font-size: 50px;
        font-weight: 200;
        text-transform: capitalize;
        letter-spacing: 1px;
        text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
    }
    h2 {
        font-size: 60px;
        display: block;
        font-weight: 700;
        letter-spacing: 3px;
        margin-bottom: .2em;
        text-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
    }
}
@media screen and (max-width: 1440px) {
    .hello {
        top: 60px;
        h3 {
            font-size: 40px;
        }
        h2 {
            font-size: 50px;
        }
    }
}
.ft {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 1;
    .sub {
        background-color: #56332f;
    }
}
.firework {
    background: #fff;
}
</style>
