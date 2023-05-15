const UserService = require("../../service/user/userService")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/config.default");
const { R, ER, CODE } = require("../../result/R")
const errcode = CODE.USER

class UserController {
    /**
     * 查询所有用户信息
     * @param {*} ctx 
     * @returns 
     */
    async getUserAll(ctx) {
        try {
            const res = await UserService.getUserAll()
            ctx.body = R("查询成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', ER(errcode, "用户查询失败"), ctx)
        }
    }

    /**
     * 注册用户
     * @param {*} ctx 
     */
    async register(ctx) {
        try {
            let res = await UserService.createUser(ctx.request.body)

            ctx.body = R("注册成功", {
                id: res.id,
                username: res.username
            })
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', ER(errcode, "注册用户失败"), ctx)
        }
    }

    /**
     * 用户登录
     * @param {*} ctx 
     * @returns 
     */
    async login(ctx) {
        try {
            const { username } = ctx.request.body
            const {password, ...res} = await UserService.getOneUserInfo({username})
            ctx.body = R("用户登录成功", {
                token: jwt.sign(res, JWT_SECRET, {expiresIn: "1d"}),
                username: res.username,
                role: res.role,
                id: res.id
            })
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, '登录失败'), ctx)
        }
    }
}


module.exports = new UserController