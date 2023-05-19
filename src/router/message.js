const Router = require("koa-router")
const messageController = require("../controller/message/messageController")
const messageMiddleware = require("../middleware/message/messageMiddleware")
const router = new Router({ prefix: "/message" })

router.get("/", async (ctx, next) => {
    ctx.body = "test!!"
})

// 添加留言
router.post("/add", messageMiddleware.verifyMessageParams, messageController.addMessage)

module.exports = router