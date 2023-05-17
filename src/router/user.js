const Router = require("koa-router")
const userController = require("../controller/user/userController")
const userMiddleware = require("../middleware/user/userMiddleware")
const { auth, adminAuth } = require("../middleware/auth/authMiddleware")
const router = new Router({ prefix: "/user" })

router.get('/', async (ctx, next) => {
    ctx.body = {
        code: 1,
        res: "Hello World!"
    };
});

// 查询所有用户
router.get("/all", userController.getUserAll)

// 注册用户
router.post("/register", userMiddleware.verifyUser, userMiddleware.userValidate, userMiddleware.crpyPassword, userController.register)
// 用户登录
router.post("/login", userMiddleware.userValidate, userMiddleware.validateLogin, userController.login)
// 用户修改个人信息
router.put("/updateUserInfo", auth, userMiddleware.validateUpdateInfo, userController.updateUserInfo)
// 用户修改密码
router.put("/updatePassword", auth, userMiddleware.verifyUpdatePassword, userController.updatePassword)
// 管理员修改用户权限  role: 1表示管理员 2表示普通用户
router.put("/updateRole/:id/:role", auth, adminAuth, userController.updateRole)
// 管理员修改用户信息
router.put("/adminUpdateUserInfo", auth, adminAuth, userController.adminUpdateUserInfo)
// 管理员禁用用户
router.post("/disableUser/:id", auth, adminAuth, userController.disableUser)
// 管理员激活用户
router.post("/activeUser/:id", auth, adminAuth, userController.activeUser)
// 分页获取用户列表
router.post("/getUserList", auth, userController.getUserList)
// 根据id查询非禁用用户信息
router.get("/getUserInfoById/:id", userController.getUserInfoById)
module.exports = router