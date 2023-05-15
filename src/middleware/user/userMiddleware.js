const bcrypt = require("bcryptjs")
const { R, ER, CODE } = require("../../result/R")
const errorCode = CODE.USER

/**
 * 校验用户名和密码是否合法
 * @param {*} ctx
 * @param {*} next
 */
const userValidate = async (ctx, next) => {
    const { username, password } = ctx.request.body
    // 是否合法
    if (!username || !password) {
        console.error("用户名或密码为空")
        return ctx.app.emit("error", ER(errorCode, "用户名或密码为空"), ctx)
    }
    if (!/^[A-Za-z0-9]+$/.test(username)) {
        console.error("用户名只能是数字和字母组成")
        return ctx.app.emit("error", ER(errorCode, "用户名只能是数字和字母组成"), ctx)
    }
    // 合法就进行下一步
    await next()
}

/**
 * 生成加盐的密码
 */
const crpyPassword = async (ctx, next) => {
    const { password } = ctx.request.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    ctx.request.body.password = hash

    await next()
}

module.exports = {
    userValidate,
    crpyPassword
}