<template>
    <div>
        <div class="methods-link">
            <h4>链接邀请，发送下发链接至邀请人</h4>
            <p>{{url}}</p>
        </div>
        <div class="methods-email">
            <h4>邮件邀请</h4>
            <!-- <input type="text" class="input" placeholder="请输入新成员的邮箱" v-model="email"> -->
            <div class="email-input">
                <p v-for="item in email"
                    :key="item.id">
                    <input type="text"
                        class="input"
                        placeholder="请输入新成员的邮箱"
                        v-model="item.value">
                </p>
                <img src="./image/add.png" alt="" @click="add" class="add">
            </div>
                <button class="btn"
                    @click="send">发送</button>
            </div>
            <div class="methods-orcode">
                <h4>通过微信扫码邀请好友</h4>
                <vue-q-art :config="config"></vue-q-art>
            </div>
        </div>
</template>
<script>
import {
    joinUrl,
    sendEmail
} from '@/api/team'
import VueQArt from 'vue-qart'
export default {
    name: 'home',
    data() {
        return {
            url: '',
            loading: true,
            imageLink: '',
            config: {
                value: '',
                imagePath: require('@/assets/logo.png')
            },
            email: [{ value: '' }]
        }
    },
    components: {
        VueQArt
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            joinUrl().then((res) => {
                this.url = res.url
                this.config.value = res.url
                this.loading = false
            }).catch(() => {
                // this.$router.replace({
                //     name: 'home'
                // })
            })
        },
        send() {
            let toEmail = []
            for (var key of Object.keys(this.email)) {
                toEmail.push(this.email[key].value)
            }
            sendEmail({
                email: toEmail.join(',')
            }).then((res) => {
                if (res.success) {
                    alert('邀请已发出')
                }
            })
        },
        add() {
            this.email.push({ value: '' })
        }
    }
}
</script>
<style lang="scss"
    scoped>
.mid {
    text-align: center;
}

.team-pic_no {
    width: 80px;
}

.email-input {
    position: relative;

    p {
        position: relative;
    }

    .add {
        position: absolute;
        left: 230px;
        bottom: 5px;
        width: 20px;
    }
}
</style>
