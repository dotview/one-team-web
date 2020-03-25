<template>
    <div>
        <el-input
          v-model.trim="form.eMail"
          class="login-input"
          placeholder="登录邮箱"
        />
        <el-input
          v-model.trim="form.userPassword"
          class="login-input"
          placeholder="密码"
          type="password"
        />
        <!-- <router-link class="login-forget" to="/page/password/reset">忘记登录密码</router-link> -->
        <el-button type="text" @click="goReset">忘记登录密码</el-button>
        <el-button type="primary" @click="submitLogin()" class="login-btn">登录</el-button>
        <p>还没有加入One Team ？<el-button type="text" @click="goRegsiter">点击这里</el-button>加入吧！</p>
    </div>
</template>
<script>
import { API_APPLICATION } from '@/api'
import { testEmail, testPwd, encrypt } from 'assets/util'
import { cookie } from '@/assets/js/cookie'
export default {
    name: 'login',
    data() {
        return {
            form: {
                eMail: '',
                userPassword: ''
            }
        }
    },
    methods: {
        submitLogin() {
            let checkRes = this.check(this.form)
            if (checkRes) {
                this.$message.error(checkRes)
                return
            }
            let submitForm = Object.assign({}, this.form, {
                userPassword: encrypt(this.form.userPassword)
            })
            this.$_post(API_APPLICATION, submitForm)
                .then(res => {
                    localStorage.setItem('token', res.token)
                    let exp = Date.now() + 60 * 60 * 1000
                    cookie.set('token', res.token, exp, '/')
                    if (this.$route.query.url) {
                        window.location.href = this.$route.query.url
                    } else {
                        this.$router.replace({
                            name: 'home'
                        })
                    }
                })
                .catch(error => {
                    this.$message.error(error.error)
                })
        },
        goRegsiter() {
            this.$router.replace({
                name: 'register'
            })
        },
        goReset() {
            this.$router.push({
                name: 'reset'
            })
        },
        check(form) {
            if (!testEmail(form.eMail)) {
                return form.eMail ? '邮箱格式错误' : '请输入登录邮箱'
            }
            if (!testPwd(form.userPassword)) {
                return form.userPassword ? '密码格式错误' : '请输入密码'
            }
        }
    }
}
</script>
<style lang='scss' scoped>
.login-input {
    margin-top: 10px;
}

.login-btn {
    width: 100%;
    margin-left: 0;
}

.login-forget {
    display: block;
    text-align: left;
    padding: 10px 0;
}
</style>
