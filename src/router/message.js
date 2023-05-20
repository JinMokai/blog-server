const Router = require("koa-router")
const messageController = require("../controller/message/messageController")
const messageMiddleware = require("../middleware/message/messageMiddleware")
const { auth, adminAuth } = require("../middleware/auth/authMiddleware")
const router = new Router({ prefix: "/message" })

router.get("/", async (ctx, next) => {
    ctx.body = "test!!"
})

// 添加留言
router.post("/add", messageMiddleware.verifyMessageParams, messageController.addMessage)
// 后台分页获取留言
router.post("/getMessageList", messageMiddleware.verifyMessagePageParams, messageController.getMessageList)
// 后台审核留言
router.put("/auditMessage/:messageId/:status", auth, adminAuth, messageController.auditMessage)
// 后台删除留言
router.delete("/delete/:id", auth, adminAuth, messageController.deleteMessage)
module.exports = router