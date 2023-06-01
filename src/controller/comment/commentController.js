const commentService = require("../../service/comment/commentService")
const { getUserInfoByComment, getArticleTitle } = require("./common")
const { R, ER, CODE } = require("../../result/R");
const errCode = CODE.COMMENT

class commentController {
    /**
     * 新增评论
     * @param {*} ctx 
     */
    async addComment(ctx) {
        const { id: user_id } = ctx.state.user
        const { content, article_id } = ctx.request.body
        try {
            const res = await commentService.addComment(user_id, content, article_id)
            ctx.body = R("添加评论成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errCode, "添加评论失败"))
        }
    }

    /**
     * 批量删除评论
     */
    async backdelete(ctx) {
        const { idList } = ctx.request.body
        try {
            const res = await commentService.backdelete(idList)
            ctx.body = R("删除评论成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errCode, "删除评论失败"), ctx)
        }
    }

    /**
    * 获取后台评论列表，支持分页
    *
    * @async
    * @function backGetCommentList
    * @param {number} current - 当前页码
    * @param {number} size - 每页数据条数
    * @returns {Promise<Object>} 返回包含评论列表的对象，格式为 { current, size, list, total }。
    *                            其中，current 表示当前页码，size 表示每页数据条数，list 是包含评论数据的数组，
    *                            total 表示符合条件的总记录数。
    */
    async backGetCommentList(ctx) {
        const { current, size, article_id } = ctx.request.body
        try {
            const res = await commentService.backGetCommentList(current, size, article_id)
            // 获取所有用户id列表
            const userArr = res.list.map((item) => item.user_id)
            // 获取用户信息
            let userInfo = await getUserInfoByComment(userArr)
            for (let i = 0; i < res.list.length; i++) {
                const userId = res.list[i].user_id
                const user = userInfo.find((item) => item.id === userId)
                if (user) {
                    res.list[i].dataValues.username = user.username
                }
            }
            ctx.body = R("分页获取评论成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errCode, "分页获取评论失败"), ctx)
        }
    }

    /**
     * 根据文章id获取对应评论
     * @param {*} ctx 
     * @returns 
     */
    async getArticleComment(ctx) {
        const { id } = ctx.params
        try {
            const userArr = await commentService.getArticleCommentUserInfo(id)
            const userInfo = await getUserInfoByComment(userArr)
            const commentInfo = await commentService.getCommentInfoById(id, { raw: true })
            const result = commentInfo.map(comment => {
                // 查找对应的用户信息
                const user = userInfo.find(info => info.id === comment.user_id)
                return {
                    comment,
                    username: user ? user.username : null
                }
            })
            ctx.body = R("获取评论成功", result)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errCode, "获取评论失败"), ctx)
        }
    }

    /**
     * 获取所有有评论的文章列表
     */
    async getCommentArticle(ctx) {
        try {
            // 有评论的文章id: Array
            let articleIds = await commentService.getCommentArticle()
            let exitArticleList = await getArticleTitle(articleIds)
            ctx.body = R("获取评论成功", exitArticleList)
        } catch (err) {
            console.log(err)
            return ctx.app.emit("error", ER(errCode, "获取评论失败"), ctx)
        }
    }
}

module.exports = new commentController()
