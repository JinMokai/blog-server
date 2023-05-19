const articleService = require("../../service/article/articleService")
const { R, ER, CODE } = require("../../result/R")
const { createCategoryAndArticle } = require("./common")
const seq = require("../../db/seq")
const errcode = CODE.CATEGARY

class articleController {
    /**
     * 获取文章信息
     * @param {*} ctx 
     */
    async getArticleById(ctx) {
        const { id } = ctx.params
        try {
            const res = await articleService.getArticleById(id)
            // @bug 过度依赖service层数据 直接res 会出现不是理想状态的boolean类型
            ctx.body = R("获取文章信息成功", res)
        } catch (err) {
            console.error("获取文章信息失败", err)
            return ctx.app.emit("error", ER(errcode, "获取文章信息失败"), ctx)
        }
    }
    /**
     * 新增文章
     */
    async createArticle(ctx) {
        // 开启事务
        const t = await seq.transaction();
        try {
            // 将分类数据抽离出来
            const { category, ...articleRest } = ctx.request.body.article
            // 将分类名传入common公共函数中，来判断分类是否存在，不存在就创建。(成功返回分类Id)
            articleRest.cat_id = await createCategoryAndArticle(category)
            // 将文章传入 并返回结果
            const res = await articleService.createArticle(articleRest)
            ctx.body = R("新增文章成功", res)
            await t.commit()
        } catch (err) {
            console.error(err)
            // 错误回滚
            await t.rollback();
            return ctx.app.emit("error", ER(errcode, "添加文章失败"), ctx)
        }
    }

    /**
     * 修改文章
     * @param {*} ctx 
     */
    async updateArticle(ctx) {
        // 开启事务
        const t = await seq.transaction();
        try {
            const { category, ...articleRest } = ctx.request.body.article
            articleRest.cat_id = await createCategoryAndArticle(category)
            const res = await articleService.updateArticle(articleRest)
            if (res) {
                ctx.body = R("修改文章成功", res)
                await t.commit()
            } else {
                ctx.body = R("没有到修改文章或修改文章失败", res)
                t.rollback();
            }
        } catch (err) {
            console.error(err)
            // 错误回滚
            t.rollback();
            return ctx.app.emit("error", ER(errcode, "修改文章失败"), ctx)
        }
    }

    /**
     * 修改文章置顶
     * @param {*} ctx 
     */
    async updateTop(ctx) {
        // isTop 0置顶 1不置顶
        const { id, isTop } = ctx.params
        try {
            const res = await articleService.updateTop(id, isTop)
            ctx.body = R("修改文章置顶成功", res)
        } catch (err) {
            console.error("修改文章置顶失败")
            return ctx.app.emit("error", ER(errcode, "修改文章置顶失败"), ctx)
        }
    }

    /**
     * 删除文章
     * @param {*} ctx 
     */
    async deleteArticle(ctx) {
        const { id, status } = ctx.params
        try {
            const res = await articleService.deleteArticle(id, status)
            ctx.body = R("删除文章成功", res)
        } catch (err) {
            console.error("删除文章失败", err)
            return ctx.app.emit("error", ER(errcode, "删除文章失败"), ctx)
        }
    }

    /**
     * 修改文章状态
     * @param {*} ctx 
     * @description 1发布 2私密
     */
    async updateStatus(ctx) {
        const { id, status } = ctx.params
        try {
            const res = await articleService.updateStatus(id, status)
            let message = Number(status) !== 1 ? '隐藏文章' : "发布文章"
            ctx.body = R(message + "成功", res)
        } catch (err) {
            console.error("修改文章状态失败", err)
            return ctx.app.emit("error", ER(errcode, "修改文章状态失败"), ctx)
        }
    }

    /**
     * 恢复文章 主要功能是将草稿箱文章恢复到发布状态
     * @param {*} ctx 
     */
    async revertArticle(ctx) {
        const { id } = ctx.params
        try {
            const res = await articleService.revertArticle(id)
            ctx.body = R("恢复文章成功", res)
        } catch (err) {
            console.error("恢复文章失败", err)
            return ctx.app.emit("error", ER(errcode, "恢复文章失败"), ctx)
        }

    }

    /**
     * 分页获取文章
     */
    async getArticleList(ctx) {
        try {
            const res = await articleService.getArticleList(ctx.request.body)
            ctx.body = R("分页获取文章成功", res)
        } catch (err) {
            console.error("分页获取文章失败", err)
            return ctx.app.emit("error", ER(errcode, "分页获取文章失败"), ctx)
        }
    }

    // 以下为前台功能

    /**
     * 分页前台获取文章(置顶和时间倒序)
     * @param {Number} current 当前页
     * @param {Number} size 页数
     */
    async homeGetArticleList(ctx) {
        const { current, size } = ctx.params
        try {
            const res = await articleService.homeGetArticleList(current, size)
            ctx.body = R("分页前台获取文章成功", res)
        } catch (err) {
            console.error("分页前台获取文章失败", err)
            return ctx.app.emit("error", ER(errcode, "分页前台获取文章失败"), ctx)
        }
    }

    /**
     * 分页前台通过分类获取文章信息
     * @param {*} ctx 
     */
    async homeGetArticleByCatId(ctx) {
        try {
            const res = await articleService.homeGetArticleByCatId(ctx.request.body)
            ctx.body = R("分页前台通过分类获取文章信息成功", res)
        } catch (err) {
            console.error("分页前台通过分类获取文章信息失败", err)
            return ctx.app.emit("error", ER(errcode, "分页前台通过分类获取文章信息失败"), ctx)
        }
    }

    /**
     * 通过文章id获取上下文
     * @param {*} ctx 
     */
    async getRecommendArticleById(ctx) {
        const { id } = ctx.params
        try {
            const res = await articleService.getRecommendArticleById(id)
            ctx.body = R("文章获取上下文成功", res)
        } catch (err) {
            console.error("文章获取上下文失败", err)
            return ctx.app.emit("error", ER(errcode, "文章获取上下文失败"), ctx)
        }
    }

    /**
     * 获取热门文章
     * @param {*} ctx 
     */
    async getHotArticle(ctx) {
        try {
            const res = await articleService.getHotArticle()
            ctx.body = R("文章获取成功", res)
        } catch (err) {
            console.error("文章获取失败", err)
            return ctx.app.emit("error", ER(errcode, "文章获取失败"), ctx)
        }
    }

    /**
     * 文章点赞
     * @param {*} ctx 
     */
    async articleThumbsUp(ctx) {
        // 获取文章id
        const { id } = ctx.params
        try {
            const res = await articleService.articleThumbsUp(id)
            if (res) {
                ctx.body = R("文章点赞成功", res)
            } else {
                ctx.body = R("文章点赞失败", res)
            }
        } catch (err) {
            console.error("文章点赞失败", err)
            return ctx.app.emit("error", ER(errcode, "文章点赞失败"), ctx)
        }
    }
}

module.exports = new articleController()