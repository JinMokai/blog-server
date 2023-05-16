const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../../config/config.default")
const { R, ER, CODE } = require("../../result/R")
const errorCode = CODE.AUTH

const auth = async (ctx, next) => {
    // 解析前端返回过来的数据 解析token
    const { authorization } = ctx.request.header;
    // 去掉(Bearer ) 获取token
    const token = authorization ? authorization.replace("Bearer ", "") : undefined
    if (!authorization) {
        console.error("您没有权限访问，请先登录")
        return ctx.app.emit("error", ER(errorCode, "您没有权限访问，请先登录"), ctx)
    }
    try {
        const user = jwt.verify(token, JWT_SECRET)
        // 将user加入state里面  ctx.state 命名空间https://www.koajs.com.cn/#:~:text=ctx.-,state,-%E6%8E%A8%E8%8D%90%E7%9A%84%E5%91%BD%E5%90%8D
        ctx.state.user = user
    } catch (err) {
        switch (err.name) {
            case "TokenExpiredError":
                console.error("token已过期", err)
                return ctx.app.emit("error", ER(errorCode, "token已过期"), ctx)
            case "JsonWebTokenError":
                console.error("无效的token", err)
                return ctx.app.emit("error", ER(errorCode, "无效的token"), ctx)
        }
    }
    await next()
}

/**
 * 检测用户权限
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const adminAuth = async (ctx, next) => {
    const { role } = ctx.state.user
    if (Number(role) !== 1) {
        console.error("普通用户查看")
        return ctx.app.emit("error", ER(errorCode, "普通用户仅查看"), ctx)
    }
    await next()
}

module.exports = {
    auth,
    adminAuth
}