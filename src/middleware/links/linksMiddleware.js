const { R, ER, CODE } = require("../../result/R")
const errCode = CODE.LINKS

/**
 * 校验添加友链是否合法
 * @param {*} ctx 
 * @param {*} next 
 */
const verifyAddLinksParams = async (ctx, next) => {
    const { site_name, site_desc, url, site_avatar } = ctx.request.body
    console.log(ctx.request.body)
    // 校验 site_name
    if (!site_name || typeof site_name !== 'string' || site_name.length > 55) {
        ctx.body = ER(errCode, '名称不能为空，长度不能超过55个字符')
        return ctx.app.emit("error", ER(errCode, '名称不能为空，长度不能超过55个字符'), ctx)
    }

    // 校验 site_desc
    if (!site_desc || typeof site_desc !== 'string' || site_desc.length > 250) {
        ctx.body = ER(errCode, '描述不能为空，长度不能超过250个字符')
        return ctx.app.emit("error", ER(errCode, '描述不能为空，长度不能超过250个字符'), ctx)
    }

    // 校验 url
    if (!/^https?:\/\/[\w\-_]+(\.[\w\-_]+)+[\w\-.,@?^=%&:/~\\+#]+/.test(url)) {
        ctx.body = ER(errCode, '网址格式不正确')
        return ctx.app.emit("error", ER(errCode, '网址格式不正确'), ctx)
    }

    // 校验网址头像 如果 site_avatar 不为空，则进行格式校验
    if (site_avatar && !/^https?:\/\/[\w\-_]+(\.[\w\-_]+)+[\w\-.,@?^=%&:/~\\+#]+/.test(site_avatar)) {
        ctx.body = ER(errCode, '网址头像格式不正确')
        return ctx.app.emit("error", ER(errCode, '网址头像格式不正确'), ctx)
    }
    await next()
}

module.exports = {
    verifyAddLinksParams
}
