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
const { getViewCount } = require("../../service/config/configService")

class staticController {
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
}

module.exports = new staticController()