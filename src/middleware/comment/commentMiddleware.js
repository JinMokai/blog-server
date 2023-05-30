const { R, ER, CODE } = require("../../result/R")
const errCode = CODE.COMMENT

/**
 * 校验添加评论参数是否合法
 * @param {*} ctx 
 * @param {*} next 
 */
const verifyAddParams = async (ctx, next) => {
    const { article_id, content } = ctx.request.body
    // if (typeof article_id != 'number' || typeof content != 'string') {
    //     ctx.body = ER(errCode, "添加评论参数不合法")
    //     return ctx.app.emit("error", ER(errCode, "添加评论参数不合法"), ctx)
    // }
    await next()
}

module.exports = {
    verifyAddParams
}