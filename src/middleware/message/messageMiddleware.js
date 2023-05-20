const { R, ER, CODE } = require("../../result/R")
const errCode = CODE.MESSAGE

/**
 * 校验留言参数是否合法
 * @param {*} ctx 
 * @param {*} next 
 */
const verifyMessageParams = async (ctx, next) => {
    const { nickname, email, website, content } = ctx.request.body
    try {
        // 校验数据不能为空
        if (nickname.trim() == '' || email.trim() == '', content.trim() == '') {
            console.warn("数据不能为空")
            ctx.body = ER(errCode, "数据不能为空")
            return ctx.app.emit("error", ER(errCode, "数据不能为空"), ctx)
        }
        // 校验邮箱格式是否正确
        if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)) {
            console.warn('邮箱格式不正确！')
            ctx.body = ER(errCode, '邮箱格式不正确！')
            return ctx.app.emit('error', ER(errCode, '邮箱格式不正确！'), ctx)
        }

        // 校验网站地址是否合法
        if (website && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(website)) {
            console.warn('网站地址格式不正确！')
            ctx.body = ER('网站地址格式不正确！')
            return ctx.app.emit('error', ER('网站地址格式不正确！'), ctx)
        }

        // 校验留言内容是否过长
        if (content.length > 300) {
            console.warn('留言内容过长！')
            ctx.body = ER('留言内容过长！')
            return ctx.app.emit('error', ER('留言内容过长！'), ctx)
        }

        // 校验数据是否合法
        if (!/^[\u4E00-\u9FFFa-zA-Z0-9_\-]+$/.test(nickname)) {
            return ctx.body = ER('nickname 格式不能包含特殊字符')
        }
    } catch (err) {
        console.error(err)
    }
    await next()
}

/**
 * 校验分页留言参数是否合法
 * @param {*} ctx 
 * @param {*} next 
 */
const verifyMessagePageParams = async (ctx, next) => {
    const { current, size } = ctx.request.body
    try {
        if (typeof current != 'number' || typeof size != 'number') {
            ctx.body = ER("参数格式不对")
            return ctx.app.emit("error", ER(errCode, "参数格式不对"))
        }
    } catch (err) {
        console.log("参数格式不对", err)
        return ctx.app.emit("error", ER(errCode, "参数格式不对"))
    }
    await next()
}
module.exports = {
    verifyMessageParams,
    verifyMessagePageParams
}