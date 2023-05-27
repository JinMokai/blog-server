const { R, ER, CODE } = require("../../result/R");
const errCode = CODE.STATIC
// 文章数据
const { getArticleCount } = require("../../service/article/articleService")
// 分类数量
const { getCategaryCount } = require("../../service/categary/cagegaryService")
// 用户数量
const { getUserCount } = require("../../service/user/userService")
// 未处理留言数量
const { getMessageCount } = require("../../service/message/messageService")
// 网站访问量
const { getViewCount } = require("../../service/config/configService");
const articleService = require("../../service/article/articleService");
const configService = require("../../service/config/configService")

class staticController {
    /**
     * 统计各信息
     * @param {} ctx 
     * @returns 
     */
    async total(ctx) {
        try {
            const { view_count } = await getViewCount()
            const articleCount = await getArticleCount()
            const categaryCount = await getCategaryCount()
            const userCount = await getUserCount()
            const messageCount = await getMessageCount()
            ctx.body = R("成功", {
                view_count, articleCount, categaryCount, userCount, messageCount
            })
        } catch (err) {
            console.log(err)
            return ctx.app.emit("error", ER(errCode, "数据统计失败"), ctx)
        }
    }

    /**
     * 统计每年文章的数量
     */
    async getArticleYearCount(ctx) {
        try {
            let res = await articleService.getArticleYearCount()
            ctx.body = R(errCode, res)
        } catch (err) {
            console.log(err)
            return ctx.app.emit("error", ER(errCode, "数据统计失败"), ctx)
        }
    }

    /**
     * 统计每月访问量
     */
    async getMonthViewCount(ctx) {
        try {
            let res = await configService.getMonthViewCount()
            ctx.body = R(errCode, res)
        } catch (err) {
            console.log(err)
            return ctx.app.emit("error", ER(errCode, "统计每月访问量失败"), ctx)
        }
    }
}

module.exports = new staticController()