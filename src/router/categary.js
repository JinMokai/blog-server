const Router = require("koa-router")
const categaryMiddle = require("../middleware/categary/categaryMiddleware")
const categaryController = require("../controller/categary/categaryController")
const { auth, adminAuth } = require("../middleware/auth/authMiddleware")
const router = new Router({ prefix: "/categary" })

// 测试
router.get("/", async (ctx, next) => {
    ctx.body = {
        code: "200",
        result: "success"
    }
})

// 管理员创建分类
router.post("/add", auth, adminAuth, categaryMiddle.verifyCategary, categaryMiddle.CategaryLive, categaryController.addCategary)
// 管理员修改分类名称 通过{ id: x, name: 'xx'} 通过id来修改
router.put("/update", auth, adminAuth, categaryMiddle.verifyCategary, categaryController.updateCategary)
// 管理员删除分类
router.post("/delete", auth, adminAuth, categaryMiddle.verifyCategary, categaryController.deleteCategary)
// 获取所有分类
router.post("/getCategaryAll", categaryController.getCategaryAll)
// 分页查询分类
router.post("/getCategoryList", categaryController.getCategaryList)
module.exports = router