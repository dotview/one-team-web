<template>
    <div :class="['okr-card', {'okr-card_center': position === 'center'}]" :style="{ backgroundColor }">
        <div class="okr-card_header" v-if="$slots.header">
            <slot name="header"></slot>
        </div>
        <div class="okr-card_body" v-if="$slots.header">
            <slot name="body"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'okrCard',
    props: {
        backgroundColor: {
            type: String,
            default: () => '#409EFF'
        },
        position: {
            type: String,
            default: () => 'left'
        }
    }
}
</script>

<style lang="scss" scoped>
.okr-card {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;
    color: #fff;
    width: 100%;
    height: 130px;
    cursor: pointer;
    padding: 8px;
    &_header {
        margin-bottom: 12px;
        line-height: 23px;
        font-weight: 600;
    }
    &_body {
        font-size: 14px;
        height: 56px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    &_center {
        align-items: center;
        justify-content: center;
    }
}
</style>
