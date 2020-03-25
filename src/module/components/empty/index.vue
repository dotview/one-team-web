<template>
    <span class="empty-wrapper">
        <img :src="emptyImg" class="empty-image" alt="暂无数据" />
        <span class="empty-text">{{ text }}</span>
    </span>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: '暂无数据'
        }
    },
    data() {
        return {
            emptyImg: require('../../user/center/common/img/fail.png')
        }
    }
}
</script>

<style lang="scss" scoped>
.empty {
    &-wrapper {
        width: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
    }
    &-image {
        margin: 30px 0;
        width: 200px;
    }
    &-text {
        font-size: 18px;
    }
}
</style>
