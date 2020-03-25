/** 邮箱校验 */
export const testEmail = (value) => {
    let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    return regEmail.test(value)
}

/** 密码校验 */
export const testPwd = (value) => {
    let regPassword = /^(?=.*\d)(?=.*[A-Za-z]).{8,16}$/g
    return regPassword.test(value)
}

/** 姓名校验 */
export const testName = (value) => {
    return /^[\u4e00-\u9fa5A-Za-z0-9-_]{2,12}$/.test(value)
}

/** 手机号码格式校验 */
export const testTel = (value) => {
    return /^1\d{10}$/.test(value)
}
