<template>
    <div class="one-team">
        <transition>
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'one-team'
}
</script>
<style lang="scss">
@import '../assets/style/animation.scss';

.one-team {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>
