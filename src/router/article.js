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
// 分页前台获取文章(置顶和时间倒序)
router.get("/homeGetArticleList/:current/:size", articleController.homeGetArticleList)
// 分页前台通过分类获取文章信息
router.post("/homeGetArticleByCatId", articleController.homeGetArticleByCatId)
// 前台通过获取 文章关联上下文
router.get("/getRecommendArticleById/:id", articleController.getRecommendArticleById)
// 获取热门文章
router.get("/getHotArticle", articleController.getHotArticle);
// ----------------------前台管理功能模块  end----------------------
// 通过id获取文章
router.get("/getArticleById/:id", articleController.getArticleById)
module.exports = router