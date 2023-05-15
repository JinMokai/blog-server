const Router = require("koa-router")
const { getUserAll,register } = require("../controller/user/userController")
const { userValidate, crpyPassword } = require("../middleware/user/userMiddleware")
const router = new Router({ prefix: "/user" })

router.get('/', async (ctx, next) => {
    ctx.body = {
        code: 1,
        res: "Hello World!"
    };
});

// 查询所有用户
router.get("/all", getUserAll)

// 注册用户
router.post("/register",userValidate, crpyPassword, register)
module.exports = router