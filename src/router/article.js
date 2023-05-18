const Router = require("koa-router")
const articleMiddle = require("../middleware/atricle/atricleMiddle")
const articleController = require("../controller/article/articleController")
const { auth, adminAuth } = require("../middleware/auth/authMiddleware")
const router = new Router({ prefix: "/article" })

// 测试
router.get("/", async (ctx, next) => {
    ctx.body = {
        code: "200",
        result: "success"
    }
})

// ----------------------后台管理功能模块  start----------------------
// 新增文章
router.post("/add", auth, adminAuth, articleMiddle.verifyArticleParam, articleMiddle.createJudgeTitleExist, articleController.createArticle)
// 修改文章
router.put("/update", auth, adminAuth, articleMiddle.verifyArticleParam, articleMiddle.updateJudgeTitleExist, articleController.updateArticle)
// 修改文章置顶状态
router.put("/updateTop/:id/:isTop", auth, adminAuth, articleMiddle.updateTopParams, articleController.updateTop)
// 删除文章 0 永久删除 1,2 回收站
router.delete("/delete/:id/:status", auth, adminAuth, articleMiddle.deleteParams, articleController.deleteArticle)
// 修改文章状态
router.put("/updateStatus/:id/:status", auth, adminAuth, articleMiddle.updateStatusParams, articleController.updateStatus)
// 恢复文章
router.put("/revert/:id", auth, adminAuth, articleController.revertArticle);
// 分页查询文章
router.post("/getArticleList", auth, articleController.getArticleList)
// ----------------------后台管理功能模块  end----------------------

// ----------------------前台管理功能模块  start----------------------

// ----------------------前台管理功能模块  end----------------------
module.exports = router