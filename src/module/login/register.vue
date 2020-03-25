<template>
    <div>
        <el-input v-model.trim="form.eMail"
            placeholder="登录邮箱"></el-input>
        <el-input v-model.trim="form.nickName"
            placeholder="姓名"></el-input>
        <el-input v-model.trim="form.userPassword"
            placeholder="6-12位字母数字密码"
            type="password"></el-input>
        <el-input v-model.trim="form.confirmPassword"
            placeholder="密码确认"
            type="password"></el-input>
        <div v-if="teamShow">
            <div class="mt10">
                <el-radio class="radio"
                    v-model="teamPick"
                    label="create">创建团队</el-radio>
                <el-radio class="radio"
                    v-model="teamPick"
                    label="join">加入团队</el-radio>
            </div>
            <el-input v-if="teamStatus"
                v-model.trim="teamName"
                class="register-input"
                placeholder="团队名称"></el-input>
            <el-input v-else
                v-model.trim="teamId"
                placeholder="团队邀请码"></el-input>
        </div>
        <el-button type="primary"
            @click="submitRegsiter"
            class="register-btn">注册</el-button>
        <p>已经注册过了？
            <el-button type="text"
                @click="goLogin">直接登录</el-button>
        </p>
    </div>
</template>
<script>
import {
    Radio
} from 'element-ui'
import {
    API_USER
} from '@/api'
import {
    testEmail,
    testPwd,
    testName,
    encrypt
} from 'assets/util'
export default {
    name: 'register',
    data() {
        return {
            teamPick: 'create',
            teamShow: !this.$route.query.id,
            form: {
                eMail: '',
                nickName: '',
                userPassword: '',
                confirmPassword: ''
            },
            teamName: '',
            teamId: ''
        }
    },
    computed: {
        teamStatus() {
            return this.teamPick === 'create'
        }
    },
    components: {
        'el-radio': Radio
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            if (!this.teamShow) {
                this.teamPick = 'join'
                this.teamId = this.$route.query.id
            }
        },
        submitRegsiter() {
            if (this.teamStatus) {
                this.form.teamName = this.teamName
            } else {
                this.form.teamId = this.teamId
            }
            if (!this.check(this.form)) {
                return
            }
            let submitForm = Object.assign({}, this.form, {
                userPassword: encrypt(this.form.userPassword),
                confirmPassword: encrypt(this.form.userPassword)
            })
            this.$_post(API_USER, submitForm).then((res) => {
                localStorage.setItem('token', res.token)
                let timer = setTimeout(() => {
                    if (localStorage.getItem('token') === res.token) {
                        clearTimeout(timer)
                        this.$router.replace({
                            name: 'home'
                        })
                    }
                }, 10)
            }).catch(error => {
                alert(error.error)
            })
        },
        goLogin() {
            this.$router.replace({
                name: 'login'
            })
        },
        check(form) {
            if (!testEmail(form.eMail)) {
                form.eMail ? alert('邮箱格式错误') : alert('请输入用户名')
                return
            }
            if (!testName(form.nickName)) {
                form.nickName ? alert('姓名格式错误') : alert('请输入姓名')
                return
            }
            if (!testPwd(form.userPassword)) {
                form.userPassword ? alert('密码格式错误') : alert('请输入密码')
                return
            }
            if (!(form.userPassword === form.confirmPassword)) {
                form.confirmPassword ? alert('两次密码不一致') : alert('请再次输入密码')
                return
            }
            if (!this.teamShow) {
                return true
            }
            if (this.teamStatus && !form.teamName) {
                alert('请输入团队名称')
                return
            }
            if (!this.teamStatus && !form.teamId) {
                alert('请输入团队邀请码')
                return
            }
            return true
        }
    }
}
</script>
<style lang='scss'
    scoped>
.el-input,
.el-button,
.mt10 {
    margin-top: 10px;
}

.register-btn {
    width: 100%;
}

.el-button--text {
    margin: 0;
}

p {
    text-align: left;
}
</style>
