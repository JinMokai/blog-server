const Router = require("koa-router")
const router = new Router({ prefix: "/static" })

const { total } = require("../controller/static/staticController")

// 统计数据
router.get("/", total)

module.exports = router