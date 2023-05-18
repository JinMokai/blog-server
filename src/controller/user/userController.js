const UserService = require("../../service/user/userService")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/config.default");
const { R, ER, CODE } = require("../../result/R");
const userService = require("../../service/user/userService");
const errcode = CODE.USER

class UserController {
    /**
     * 通过id查询用户名
     * @param {Number} id 
     */
    async getUserNameById(id) {
        try {
            const res = await userService.getUserNameById(id)
            return res
        } catch (err) {
           console.error("查询用户名失败",err) 
           return ctx.app.emit("error", ER(errcode,"查询用户名失败"), ctx)
        }
    }
    /**
     * 根据id查询非禁用用户信息
     * @param {*} ctx 
     */
    async getUserInfoById(ctx) {
        const { id } = ctx.params
        try {
            // 过滤掉密码
            const { password, ...res } = await userService.getOneUserInfo({ id })
            ctx.body = R("查询用户信息成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "查询用户信息失败"), ctx)
        }
    }
    /**
     * 查询所有用户信息(包含禁用用户)
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
            const { password, ...res } = await UserService.getOneUserInfo({ username })
            ctx.body = R("用户登录成功", {
                token: jwt.sign(res, JWT_SECRET, { expiresIn: "1d" }),
                username: res.username,
                role: res.role,
                id: res.id
            })
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, '登录失败'), ctx)
        }
    }

    /**
     * 修改用户信息
     * @param {*} ctx 
     * @param {*} next 
     */
    async updateUserInfo(ctx) {
        // 获取ctx.state.user里面的信息
        const { id } = ctx.state.user
        const { username } = ctx.request.body
        try {
            // 通过UserService层修改用户数据
            let res = await UserService.updateUserInfo(id, username)
            ctx.body = R("用户修改成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', ER(errcode, "修改用户失败"), ctx)
        }
    }


    /**
     * 修改密码
     * @param {*} ctx 
     * @param {*} next 
     */
    async updatePassword(ctx) {
        const { id } = ctx.state.user
        const { password1 } = ctx.request.body
        try {
            // 将id和修改的密码传入Service层
            const res = await userService.updatePassword(id, password1)
            ctx.body = R("修改用户密码成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "修改用户密码失败"), ctx)
        }
    }

    /**
     * 管理员修改普通用户权限
     * @param {*} ctx 
     * @param {*} next 
     */
    async updateRole(ctx) {
        const { id, role } = ctx.params
        try {
            const res = await UserService.updateRole(id, role)
            // @bug 如果用户权限不变，不应该修改
            ctx.body = R("修改用户成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "修改用户权限失败"), ctx)
        }
    }


    /**
     * 管理员修改用户的用户名
     * @param {*} ctx 
     */
    async adminUpdateUserInfo(ctx) {
        const { id, username } = ctx.request.body
        try {
            const res = await UserService.adminUpdateUserInfo(id, username)
            ctx.body = R("修改用户名成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "修改用户信息失败"), ctx)
        }
    }

    /**
     * 禁止用户
     */
    async disableUser(ctx) {
        const { id } = ctx.params
        try {
            const res = await userService.disableUser(id)
            ctx.body = R("禁止用户成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "禁止用户失败"), ctx)
        }
    }

    /**
     * 激活用户
     * @param {*} ctx 
     */
    async activeUser(ctx) {
        const { id } = ctx.params
        try {
            const res = await userService.activeUser(id)
            ctx.body = R("激活用户成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "激活用户成功"), ctx)
        }
    }

    /**
     * 分页查询用户
     */
    async getUserList(ctx) {
        try {
            const { current, size, username, role } = ctx.request.body
            const res = await userService.getUserList({ current, size, username, role })
            ctx.body = R("分页获取用户列表成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "分页获取用户列表失败"), ctx)
        }
    }
}


module.exports = new UserController