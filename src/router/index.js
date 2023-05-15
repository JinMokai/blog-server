
const fs = require("fs"); // 文件模块
const Router = require("koa-router");

const router = new Router();
/**
 * 通过遍历router路由文件夹下面的所有*.js文件来自动创建路由
 */
fs.readdirSync(__dirname).forEach((file) => {
  if (file !== "index.js") {
    let r = require("./" + file);
    router.use(r.routes());
  }
});

module.exports = router;
