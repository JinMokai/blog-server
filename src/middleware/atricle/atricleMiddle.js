const { R, ER, CODE } = require("../../result/R")
const { getOneArticleInfoByTitle } = require("../../service/article/articleService")
const errorCode = CODE.ARTICLE

/**
 * 验证文章参数
 * @param {*} ctx 
 * @param {*} next 
 */
const verifyArticleParam = async (ctx, next) => {
    const { user_id, title, category, content } = ctx.request.body.article
    if (!category) {
        console.error("文章分类必须要有！")
        return ctx.app.emit("error", ER(errorCode, "文章分类必须要有！"), ctx)
    }
    if (!user_id || !title || !category || !content.trim()) {
        console.error("文章参数不合法！")
        return ctx.app.emit("error", ER(errorCode, "文章参数不合法！"), ctx)
    }
    await next()
}

/**
 * 校验文章标题是否存在
 * @param {*} ctx 
 * @param {*} next 
 */
const createJudgeTitleExist = async (ctx, next) => {
    const { title } = ctx.request.body.article
    const res = await getOneArticleInfoByTitle({ title })
    // 如果文章内容已存在就return
    if (res) {
        console.error("已存在相同的文章标题")
        return ctx.app.emit("error", ER(errorCode, "已存在相同的文章标题"), ctx)
    }
    await next()
}

/**
 * 编辑文章判断被修改的标题是否已经存在
 * @param {*} ctx 
 * @param {*} next 
 */
const updateJudgeTitleExist = async (ctx, next) => {
    const { id, title } = ctx.request.body.article
    const res = await getOneArticleInfoByTitle({ id, title })
    // 如果文章内容已存在就return
    if (res) {
        console.error("已存在相同的文章标题")
        return ctx.app.emit("error", ER(errorCode, "已存在相同的文章标题"), ctx)
    }
    await next()
}

/**
 * 校验修改文章置顶参数
 * @param {*} ctx 
 * @param {*} next 
 */
const updateTopParams = async (ctx, next) => {
    const { id, isTop } = ctx.params
    if (!/^[0-9]+$/.test(id) || !/^[0-9]+$/.test(isTop)) {
        return ctx.app.emit("error", ER(errorCode, "参数只能为数字"), ctx)
    }
    if (!/^[0-1]$/.test(isTop)) {
        return ctx.app.emit("error", ER(errorCode, "置顶参数只能为0或1"), ctx)
    }
    await next()
}

/**
 * 校验删除文章参数
 * @param {*} ctx 
 * @param {*} next 
 */
const deleteParams = async (ctx, next) => {
    const { id, status } = ctx.params
    if (!/^[0-9]+$/.test(id) || !/^[0-9]+$/.test(status)) {
        return ctx.app.emit("error", ER(errorCode, "参数只能为数字"), ctx)
    }
    await next()
}

/**
 * 校验修改文章私密
 * @param {*} ctx 
 * @param {*} next 
 */
const updateStatusParams = async (ctx, next) => {
    // status 只能为 1 发布 2私密
    const { id, status } = ctx.params
    if (!/^[0-9]+$/.test(id) || !/^[0-9]+$/.test(status)) {
        return ctx.app.emit("error", ER(errorCode, "参数只能为数字"), ctx)
    }
    if (!/^[1-2]$/.test(status)) {
        return ctx.app.emit("error", ER(errorCode, "参数只能为1或2"), ctx)
    }
    await next()
}

module.exports = {
    verifyArticleParam,
    createJudgeTitleExist,
    updateJudgeTitleExist,
    updateTopParams,
    deleteParams,
    updateStatusParams
}