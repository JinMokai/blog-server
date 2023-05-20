/**
 * 网站设置路由
 */
const Router = require("koa-router")
const router = new Router({ prefix: "/config" })

const { auth, adminAuth } = require("../middleware/auth/authMiddleware")
const configController = require("../controller/config/configController")

// 修改网站设置
router.post("/update", auth, adminAuth, configController.updateConfig)

// 获取网站设置
router.get("/", configController.getConfig)

// 修改网站设置的访问次数
router.put("/addView", configController.addView)

module.exports = router
