const { R, ER, CODE } = require("../../result/R")
const { getCategaryOne } = require("../../service/categary/cagegaryService")
const errorCode = CODE.CATEGARY

/**
 * 校验分类数据是否合法
 * @param {*} ctx 
 * @param {*} next 
 */
const verifyCategary = async (ctx, next) => {
    const {name } = ctx.request.body
    try {
        if (name.trim() == '') {
            return ctx.app.emit("error", ER(errorCode, "分类不能为空字符"), ctx)
        }
    } catch (err) {
        console.error("分类不能为空字符", err)
        return ctx.app.emit("error", ER(errorCode, "创建分类失败"), ctx)
    }
    await next()
}

/**
 * 检测分类是否存在
 * @param {*} ctx 
 * @param {*} next 
 * @returns 
 */
const CategaryLive = async (ctx, next) => {
    const {name } = ctx.request.body
    try {
        const res = await getCategaryOne({ name })
        // 如果查询分类存在
        if (res) {
            return ctx.app.emit("error", ER(errorCode, "分类已存在"), ctx)
        }
    } catch (err) {
        console.error("分类已存在", err)
        return ctx.app.emit("error", ER(errorCode, "创建分类失败"), ctx)
    }
    await next()
}

module.exports = {
    verifyCategary,
    CategaryLive
}