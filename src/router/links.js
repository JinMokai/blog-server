const Router = require("koa-router")
const linksController = require("../controller/links/linksController")
const linksMiddleware = require("../middleware/links/linksMiddleware")
const { auth, adminAuth } = require("../middleware/auth/authMiddleware")
const router = new Router({ prefix: "/links" })

router.get("/", async (ctx, next) => {
    ctx.body = "test!!"
})

// 添加友链
router.post("/addOrUpdateLinks", linksMiddleware.verifyAddLinksParams, linksController.addOrUpdateLinks)
// 删除友链
router.put("/delete", auth, adminAuth, linksController.deleteLinks);
// 批量审核友链
router.put("/approve", auth, adminAuth, linksController.approveLinks);
// 分页获取友链
router.post("/getLinksList", linksController.getLinksList);
module.exports = router