<template>
    <transition name="fade">
        <router-view></router-view>
    </transition>
</template>
<script>
export default {
    name: 'app'
}
</script>
<style lang="scss">
@import 'assets/style/reset.scss';
</style>
