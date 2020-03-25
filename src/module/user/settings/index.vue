<template>
    <div>
        <h2>个人设置</h2>
        <div class="setting-cells">
            <div class="part-photo">
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  :action="uploadTarget"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess">
                    <avator :src="user.headPortrait" style="margin-right: 5px;" width="90px" radius="6px" :placeholder="user.nickName" />
                    <span class="txt_photo__title">修改</span>
                </el-upload>
            </div>
            <el-collapse accordion
                :value="openItem">
                <el-collapse-item name="nickName">
                    <template slot="title">
                        <div class="setting-item"
                            @click="setEditFlag('nickName')">
                            <label class="setting-item__label">姓名</label>
                            <p class="setting-item__value">{{user.nickName | contentFilter(editflag !== 'name', '姓名')}}</p>
                            <a href="javascript:;">{{btnTxt | editBtnFilter(editflag !== 'nickName') }}</a>
                        </div>
                    </template>
                    <div class="area_edit">
                        <el-input class="edit_input disb"
                            v-model="userEdit.name.nickName"
                            placeholder="姓名">
                        </el-input>
                        <el-button type="primary"
                            @click="updateInfo('name')"
                            plain
                            size="small">确定</el-button>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="eMail">
                    <template slot="title">
                        <div class="setting-item"
                            @click="setEditFlag('eMail')">
                            <label class="setting-item__label">邮箱</label>
                            <p class="setting-item__value">{{user.eMail | contentFilter(editflag !== 'email', '邮箱')}}</p>
                            <a href="javascript:;">{{btnTxt | editBtnFilter(editflag !== 'eMail') }}</a>
                        </div>
                    </template>
                    <div class="area_edit">
                        <el-input class="edit_input disb"
                            v-model="userEdit.email.oldPassword"
                            placeholder="请输入用户密码"
                            type="password">
                        </el-input>
                        <el-input class="edit_input disb"
                            v-model="userEdit.email.eMail"
                            placeholder="请输入新邮箱">
                        </el-input>
                        <el-button type="primary"
                            @click="updateInfo('email')"
                            plain
                            size="small">修改</el-button>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="phoneNumber">
                    <template slot="title">
                        <div class="setting-item"
                            @click="setEditFlag('phoneNumber')">
                            <label class="setting-item__label">手机号码</label>
                            <p class="setting-item__value">{{user.phoneNumber | contentFilter(editflag !== 'phone', '手机号')}}</p>
                            <a href="javascript:;">{{btnTxt | editBtnFilter(editflag !== 'phoneNumber') }}</a>
                        </div>
                    </template>
                    <div class="area_edit">
                        <el-input class="edit_input disb"
                            v-model="userEdit.tel.phoneNumber"
                            :maxlength="11"
                            placeholder="新手机号">
                        </el-input>
                        <el-button type="primary"
                            @click="updateInfo('tel')"
                            plain
                            size="small">确定</el-button>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="userPassword">
                    <template slot="title">
                        <div class="setting-item"
                            @click="setEditFlag('userPassword')">
                            <label class="setting-item__label">密码</label>
                            <p class="setting-item__value">重置密码</p>
                            <a href="javascript:;">{{btnTxt | editBtnFilter(editflag !== 'userPassword') }}</a>
                        </div>
                    </template>
                    <div class="area_edit">
                        <el-input class="edit_input disb"
                            v-model="userEdit.password.oldPassword"
                            placeholder="老密码"
                            type="password">
                        </el-input>
                        <el-input class="edit_input disb"
                            v-model="userEdit.password.userPassword"
                            placeholder="新密码"
                            type="password">
                        </el-input>
                        <el-input class="edit_input disb"
                            v-model="userEdit.password.confirmPassword"
                            placeholder="新密码确认"
                            type="password">
                        </el-input>
                        <el-button type="primary"
                            @click="updateInfo('password')"
                            plain
                            size="small">确定</el-button>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script>
import {
    API_USER,
    API_UPLOAD
} from '@/api'
import {
    testEmail,
    testPwd,
    testName,
    testTel,
    encrypt
} from 'assets/util'
import {
    Collapse,
    CollapseItem,
    Upload
} from 'element-ui'
import avator from 'components/avator'
export default {
    name: 'personal-settings',
    data() {
        return {
            uploadTarget: API_UPLOAD,
            editflag: '',
            openItem: '',
            user: {
                headPortrait: require('../image/cat.png'),
                nickName: '',
                eMail: '',
                phoneNumber: ''
            },
            userEdit: {
                head: {
                    headPortrait: ''
                },
                name: {
                    nickName: ''
                },
                email: {
                    oldPassword: '',
                    eMail: ''
                },
                tel: {
                    phoneNumber: ''
                },
                password: {
                    oldPassword: '',
                    userPassword: '',
                    confirmPassword: ''
                }
            },
            btnTxt: '编辑',
            focusing: false
        }
    },
    filters: {
        contentFilter(val, flag, itemName) {
            return !flag ? ('原' + itemName + ': ' + val) : val
        },
        editBtnFilter(val, flag) {
            return !flag ? '  ' : val
        }
    },
    components: {
        'el-collapse': Collapse,
        'el-collapse-item': CollapseItem,
        'el-upload': Upload,
        avator
    },
    created() {
        this.initInfo()
    },
    methods: {
        /**
         * initialize user info
         */
        initInfo() {
            this.$_get(API_USER).then((res) => {
                Object.assign(this.user, res)
            }).catch(error => {
                this.$message.error(error.error)
            })
        },
        uploadUpdate() {
            this.$refs.upload.click()
        },
        handleAvatarSuccess(res, file) {
            this.user.headPortrait = URL.createObjectURL(file.raw)
            if (res.success) {
                this.userEdit.head.headPortrait = res.files[0].url
                this.updateInfo('head')
            } else {
                this.$message.error(res.msg)
            }
        },
        /**
         * Sets the editing flag.
         *
         * @param      {string}  item    The item
         */
        setEditFlag(item) {
            if (this.editflag === item) {
                this.editflag = ''
            } else {
                this.editflag = item
            }
        },
        /**
         * update user info
         *
         * @param      {<type>}  item    The item
         */
        updateInfo(item) {
            let formData = Object.assign({}, this.userEdit[item])
            console.log()
            if (!this.check(formData)) {
                return
            }
            for (let item of Object.keys(formData)) {
                if (item.indexOf('Password') > -1) {
                    formData[item] = encrypt(formData[item])
                }
            }
            this.$_patch(API_USER, formData).then((res) => {
                Object.assign(this.user, res)
                for (let k of Object.keys(formData)) {
                    this.userEdit[item][k] = ''
                }
                this.openItem = ''
                this.$message({
                    message: '信息修改成功',
                    type: 'success'
                })
            }).catch(error => {
                this.$message.error(error.error)
            })
        },
        check(formData) {
            let checkRule = {
                nickName: {
                    tip: '请输入格式正确的姓名',
                    reg: testName
                },
                oldPassword: {
                    tip: '请输入格式正确的旧密码',
                    reg: testPwd
                },
                eMail: {
                    tip: '请输入格式正确的邮箱',
                    reg: testEmail
                },
                phoneNumber: {
                    tip: '请输入格式正确的手机号码',
                    reg: testTel
                },
                userPassword: {
                    tip: '请输入格式正确的新密码',
                    reg: testPwd
                }
            }
            for (let item of Object.keys(formData)) {
                let reg = checkRule[item] ? checkRule[item].reg : ''
                if (reg && !reg(formData[item])) {
                    this.$message.error(checkRule[item].tip)
                    return
                }
            }
            if (formData.userPassword && formData.userPassword !== formData.confirmPassword) {
                this.$message.error('两次密码不一致')
                return
            }
            return true
        }
    }
}
</script>
<style lang='scss'
    scoped>
.part-photo {
    position: relative;
    height: 90px;
    margin-bottom: 30px;
}

.avatar-uploader {
    width: 150px;
    cursor: pointer;
    span {
        padding-left: 10px;
        color: #409EFF;
        font-size: 14px;
    }
}

.setting-cells {
    padding: 0 10px;
}

.setting-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.setting-item__label {
    width: 30%;
}

.setting-item__value {
    flex: 1;
}

.area_edit {
    padding-left: 29%;
}

.setting-item__filed {
    padding-left: 10px;
    display: inline-block;
}

.edit_input {
    max-width: 200px;
    margin-bottom: 5px
}

.fr {
    float: right;
}

.disb {
    display: block;
}

.link-delete {
    display: block;
    position: absolute;
    right: 40px;
    top: 30px;
    font-size: 12px;
    color: #cf372b;
}

h2 {
    margin-bottom: 30px;
    font-size: 18px;
}

/deep/ .el-collapse-item__header,
/deep/ .el-collapse-item__wrap {
    background-color: transparent;
}

.is-active {
    background-color: #fcfcfc;
}
</style>
