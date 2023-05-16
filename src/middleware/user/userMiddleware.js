const bcrypt = require("bcryptjs")
const { R, ER, CODE } = require("../../result/R")
const { getOneUserInfo } = require("../../service/user/userService")
const errorCode = CODE.USER


/**
 * 校验用户名注册是否存在
 * @param {*} ctx 
 * @param {*} next 
 */
const verifyUser = async (ctx, next) => {
    const { username } = ctx.request.body
    try {
        const res = await getOneUserInfo({ username })
        // 如果用户存在
        if (res) {
            console.error("用户名存在", { username })
            return ctx.app.emit("error", ER(errorCode, "用户名已存在"), ctx)
        }
    } catch (err) {
        console.error("用户获取错误", err)
        return ctx.app.emit("error", ER(errorCode, "用户获取错误"), ctx)
    }
    await next()
}
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

/**
 * 验证用户登录是否存在&密码是否匹配
 * @param {*} ctx 
 * @param {*} next 
 */
const validateLogin = async (ctx, next) => {
    const { username, password } = ctx.request.body
    try {
        const res = await getOneUserInfo({ username })
        // 用户不存在
        if (!res) {
            console.error("用户不存在")
            return ctx.app.emit("error", ER(errorCode, "用户不存在"), ctx)
        }
        // 密码不匹配
        if (!bcrypt.compareSync(password, res.password)) {
            console.error("密码不匹配")
            return ctx.app.emit("error", ER(errorCode, "密码不匹配", ctx))
        }
    } catch (err) {
        console.error(err)
        return ctx.app.emit("error", ER(errorCode, "用户校验失败"), ctx)
    }
    await next()
}

/**
 * 校验用户修改信息时不合法数据
 * @param {*} ctx 
 * @param {*} next 
 */
const validateUpdateInfo = async (ctx, next) => {
    const { id } = ctx.state.user
    const { username } = ctx.request.body
    try {
        if (username.trim() === '') {
            return ctx.app.emit("error", ER(errorCode, "用户名不能为空"), ctx)
        }
        if (typeof username !== 'string') {
            return ctx.app.emit("error", ER(errorCode, "用户名必须字符串"), ctx)
        }
        const { username: ruser } = await getOneUserInfo({ id })
        if (username === ruser) {
            return ctx.app.emit("error", ER(errorCode, "用户名不应该相等"), ctx)
        }
    } catch (err) {
        console.error(err)
        return ctx.app.emit("error", ER(errorCode, "用户信息验证失败"), ctx)
    }
    await next()
}

/**
 * 验证用户密码
 * @param {} ctx 
 * @param {*} next 
 */
const verifyUpdatePassword = async (ctx, next) => {
    try {
        const { id } = ctx.state.user
        // 原来 密码 第一次确定密码 第二次确定密码
        const { password, password1, password2 } = ctx.request.body
        if (password1 != password2) {
            console.error("两次输入密码不一致")
            return ctx.app.emit("error", ER(errorCode, "两次输入密码不一致"), ctx)
        }
        // 从数据库中拿出数据来判断用户
        const res = await getOneUserInfo({ id })
        if (!bcrypt.compareSync(password, res.password)) {
            console.error("密码不匹配")
            return ctx.app.emit("error", ER(errorCode, "密码不匹配"), ctx)
        }
        // 如果真实密码和修改后的密码一样 就弹出
        if (bcrypt.compareSync(password1, res.password)) {
            console.error("真实密码不应该和修改密码一致")
            return ctx.app.emit("error", ER(errorCode, "真实密码不应该和修改密码一致"), ctx)
        }
    } catch (err) {
        console.error(err)
        return ctx.app.emit("error", ER(errorCode, "修改用户密码校验失败"), ctx)
    }

    await next()
}

module.exports = {
    userValidate,
    crpyPassword,
    validateLogin,
    validateUpdateInfo,
    verifyUser,
    verifyUpdatePassword
}