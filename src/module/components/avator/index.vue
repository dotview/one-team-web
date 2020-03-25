<template>
    <div class="one-team_avator">
        <img :src="src" v-if="src" :style="{ width, height: width, borderRadius: radius }" alt="暂无数据" />
        <div v-else class="avator_placeholder" :style="{ width, height: width, borderRadius: radius, borderRadius: radius, background, fontSize: size }">{{ name }}</div>
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Oneteam'
        },
        width: {
            type: String,
            default: '40px'
        },
        radius: {
            type: String,
            default: '50%'
        },
        background: {
            type: String,
            default: '#409eff'
        },
        size: {
            type: String,
            default: '16px'
        }
    },
    data() {
        return {
            emptyImg: require('../../user/center/common/img/fail.png')
        }
    },
    computed: {
        name() {
            if (this.placeholder.length >= 3) {
                return this.placeholder.slice(1)
            } else {
                return this.placeholder
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.one-team_avator {
    display: inline-block;
}
.avator_placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    vertical-align: text-top;
}
</style>
