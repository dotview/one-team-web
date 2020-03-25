<!-- wusong by 20181128 -->
<template>
    <div class="password-reset">
        <div class="password-reset__content">
            <h1>{{title}}</h1>
            <p class="subtitle">{{desc}}</p>
            <!-- 发送验证码 -->
            <div
                class="password-reset__item"
                v-if="step1"
            >
                <el-input
                    v-model.trim="form.email"
                    placeholder="请输入绑定邮箱"
                ></el-input>
                <el-button
                    type="primary"
                    @click="next"
                >下一步</el-button>
            </div>
            <!-- 校验验证码 -->
            <div
                class="password-reset__item"
                v-if="step2"
            >
                <el-input
                    v-model.trim="form.email"
                    placeholder="请输入绑定邮箱"
                ></el-input>
                <el-input
                    class="ipt-margin"
                    v-model.trim="form.code"
                    :maxlength="6"
                    type="tel"
                    placeholder="请输入6位邮箱验证码"
                ></el-input>
                <el-button
                    type="primary"
                    @click="vert"
                >下一步</el-button>
            </div>
            <!-- 设置新密码 -->
            <div
                class="password-reset__item"
                v-if="step3"
            >
                <el-input
                    type="password"
                    v-model.trim="form.pwd"
                    placeholder="新密码"
                ></el-input>
                <el-input
                    class="ipt-margin"
                    type="password"
                    v-model.trim="form.confirmPwd"
                    placeholder="再次输入新密码"
                ></el-input>
                <el-button
                    type="primary"
                    @click="fnSetPwd"
                >重置密码</el-button>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import { testEmail, testPwd, encrypt } from 'assets/util'
import {
    API_USER_EMAILCODE,
    API_USER_CHECKEMAILCODE,
    API_USER_SETPASSPWD
} from '@/api/user'
const TITLE = {
    UNSEND: '找回密码',
    SENDED: '找回密码',
    SETPASSWORD: '设置新密码'
}
const DESC = {
    UNSEND: '验证码将会发送至你的注册邮箱',
    SENDED: '验证码已发送至你的注册邮箱',
    SETPASSWORD: '新密码8～16位，包含字母数字和特殊字符'
}
export default {
    name: 'password_reset',
    data() {
        return {
            title: '',
            desc: '',
            tType: '',
            form: {
                email: '',
                code: '',
                pwd: '',
                confirmPwd: '',
                id: ''
            },
            step1: true,
            step2: false,
            step3: false
        }
    },
    watch: {
        tType(val, oldVal) {
            this.title = TITLE[val]
            this.desc = DESC[val]
            this.changeItem(val)
        }
    },
    created() {
        this.tType = 'UNSEND'
    },
    methods: {
        next() {
            let json = { email: this.form.email }
            if (!this.check(json)) {
                return
            }
            this.$_post(API_USER_EMAILCODE, json)
                .then(res => {
                    this.tType = 'SENDED'
                })
                .catch(error => {
                    this.$message.error(error.error)
                })
        },
        vert() {
            let json = { email: this.form.email, code: this.form.code }
            if (!this.check(json)) {
                return
            }
            this.$_get(API_USER_CHECKEMAILCODE, json)
                .then(res => {
                    this.tType = 'SETPASSWORD'
                    this.form.id = res.id
                })
                .catch(error => {
                    this.$message.error(error.error)
                })
        },
        fnSetPwd() {
            let json = {
                pwd: this.form.pwd,
                confirmPwd: this.form.confirmPwd
            }
            if (!this.check(json)) {
                return
            }
            if (json.pwd !== json.confirmPwd) {
                this.$message.error('两次密码输入不一致')
                return
            }
            this.$_post(API_USER_SETPASSPWD, {
                id: this.form.id,
                pwd: encrypt(this.form.pwd),
                confirmPwd: encrypt(this.form.confirmPwd)
            })
                .then(res => {
                    // 密码设置成功，调到首页
                    localStorage.setItem('token', res.token)
                    this.$router.push({ name: 'home' })
                })
                .catch(error => {
                    this.$message.error(error.error)
                })
        },
        check(form) {
            let test = {
                email: val => {
                    if (!testEmail(val)) {
                        val
                            ? this.$message.error('邮箱格式错误')
                            : this.$message.error('请输入邮箱')
                        return false
                    }
                    return true
                },
                pwd: val => {
                    if (!testPwd(val)) {
                        val
                            ? this.$message.error('新密码格式错误')
                            : this.$message.error('请输入新密码')
                        return false
                    }
                    return true
                },
                confirmPwd: val => {
                    if (!testPwd(val)) {
                        val
                            ? this.$message.error('再次输入密码格式错误')
                            : this.$message.error('请再次输入密码')
                        return false
                    }
                    return true
                },
                code: val => {
                    if (!/^\d{6}$/.test(val)) {
                        val
                            ? this.$message.error('验证码格式错误')
                            : this.$message.error('请输入验证码')
                        return false
                    }
                    return true
                }
            }
            console.log('要检查的项', Object.keys(form))
            for (let key of Object.keys(form)) {
                if (!test[key](form[key])) {
                    return false
                }
            }
            return true
        },
        changeItem(type) {
            this.step1 = this.step2 = this.step3 = false
            if (type === 'UNSEND') {
                this.step1 = true
            }
            if (type === 'SENDED') {
                this.step2 = true
            }
            if (type === 'SETPASSWORD') {
                this.step3 = true
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.password-reset {
    width: 100%;
    height: 100%;
    background-color: #fff;
}

.password-reset__content {
    width: 320px;
    margin: 10% auto 0;

    h1 {
        font-size: 24px;
        color: #1a1a1a;
        font-weight: 600;
    }

    .subtitle {
        margin: 4px 0 40px;
        font-size: 15px;
        font-weight: 400;
        color: #8590a6;
    }
}

.el-button--primary {
    display: block;
    width: 100%;
    margin-top: 32px;
}
.ipt-margin {
    margin-top: 15px;
}
</style>
