const Router = require("koa-router")
const router = new Router({ prefix: "/static" })

const { total, getArticleYearCount, getMonthViewCount } = require("../controller/static/staticController")

// 统计数据
router.get("/", total)
// 每年文章数量统计
router.get("/year", getArticleYearCount)
// 每月网站
router.get("/month", getMonthViewCount)

module.exports = router