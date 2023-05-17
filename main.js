const path = require("path")
const http = require("http")
const json = require("koa-json")
const parameter = require("koa-parameter");
const logger = require("koa-logger")
const onerror = require("koa-onerror")
const { koaBody } = require("koa-body");
const static = require("koa-static")

const router = require("./src/router/index")
const errHandler = require("./src/app/errHandler")
const { APP_PORT } = require("./src/config/config.default")
const { ER,CODE } = require("./src/result/R")

const koa = require("koa")
const app = new koa()

onerror(app)
koaBody({
    multipart: true, // 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, "./src/public/upload"), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    },
})
// http请求日志
app.use(logger())
// 格式化输出的json
app.use(json())
// 全功能解析器中间件
app.use(koaBody())
// app parameter参数，捕获错误
app.use(parameter(app))
// 路由
app.use(router.routes()).use(router.allowedMethods())
// 静态文件处理
app.use(static(path.join(__dirname, "./public/assets")))
app.use(static(path.join(__dirname, "./public/upload")))

// 如果没有匹配到数据统一返回结果
app.use(async (ctx, next) => {
    ctx.body = ER(CODE.NOTFOUNT, "没有找到数据")
})

// 错误级别
app.on("error", errHandler)

// 没有匹配的数据就返回
let port = APP_PORT || "3000"
let server = http.createServer(app.callback())

server.listen(port, () => {
    console.log(`server is running on http://localhost:${APP_PORT || "3000"}`)
})