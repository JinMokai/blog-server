/**
 * 上传图片路由
 */
const Router = require("koa-router")
const uploadController = require("../controller/upload/uploadController")
const router = new Router({ prefix: "/upload" })

router.post("/upload", uploadController.uploadFile)

module.exports = router