const Router = require("koa-router")
const commentController = require("../controller/comment/commentController")
const commentMiddleware = require("../middleware/comment/commentMiddleware")
const { auth, adminAuth } = require("../middleware/auth/authMiddleware")
const router = new Router({ prefix: "/comment" })

// 新增评论
router.post("/add", auth, commentMiddleware.verifyAddParams, commentController.addComment)

// 后台删除评论
router.delete("/backdelete/:id", auth, adminAuth, commentController.backdelete)
// 后台分页获取评论
router.post("/backGetCommentList", auth, adminAuth, commentController.backGetCommentList)
// 通过文章id获取评论信息
router.get("/getArticleComment/:id", commentController.getArticleComment)
module.exports = router