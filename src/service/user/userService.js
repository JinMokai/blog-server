const User = require("../../model/user/userModel")
const bcrypt = require("bcryptjs")
const { Op, where } = require("sequelize");

class UserService {
    /**
     * 通过id查询用户名
     * @param {Number} id
     * @returns {Promise<Object>} 返回一个Promise,包含以下字段:
     *  - {String} username - 用户名
     */
    async getUserNameById(id) {
        const res = await User.findOne({
            attributes: ['username'],
            where: { id }
        })
        return res.dataValues
    }
    /**
     * 查询所有用户
     * @returns Object
     */
    async getUserAll() {
        let res = await User.findAll({
            attributes: {
                exclude: ['password', 'created']
            }
        })
        return res
    }

    /**
     * 创建用户
     * @param {*} ctx 
     */
    async createUser(user) {
        let { username, password } = user
        // 数据库默认就是  先加上
        const avatar = 'http://localhost:8888/default.png'
        const res = await User.create({ username, password, avatar })
        return res.dataValues
    }

    /**
     * 查询用户信息
     * @param {*} user 
     */
    async getOneUserInfo(user) {
        const { id, username, password, role } = user
        // 用户必须是没有禁用的
        const whereOpt = { status: 1 }
        id && Object.assign(whereOpt, { id })
        username && Object.assign(whereOpt, { username })
        password && Object.assign(whereOpt, { password })
        role && Object.assign(whereOpt, { role })

        const res = await User.findOne({
            attributes: { exclude: ['created'] },
            where: whereOpt
        })

        return res ? res.dataValues : null;
    }

    /**
     * 修改用户信息
     * @param {*} id 用户id
     * @param {*} username 用户名
     * @Returns Boolean
     */
    async updateUserInfo(id, username) {
        const res = await User.update({ username }, { where: { id } })
        console.log(res, 'serviceupdateinfo')
        // 修改成功返回boolen
        return res[0] > 0 ? true : false
    }

    /**
    * 修改密码
    * @param {*} ctx 
    * @param {*} next 
    */
    async updatePassword(id, password) {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const res = await User.update({ password: hash }, { where: { id } })
        return res[0] > 0 ? true : false
    }

    /**
     * 管理员修改普通用户权限
     */
    async updateRole(id, role) {
        // Executing (default): UPDATE `users` SET `role`=? WHERE `id` = '5' 
        const res = await User.update({ role: role }, {
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        })
        return res[0] > 0 ? true : false
    }

    /**
     * 管理员修改用户的用户名
     */
    async adminUpdateUserInfo(id, username) {
        // @bug 如果id数据很大不在表中 在控制类中会显示成功 这是不能理解的 所以校验
        const res = await User.update({ username }, { where: { id } })
        return res[0] > 0 ? true : false
    }

    /**
     * 禁止用户
     * @param {Number} id 
     */
    async disableUser(id) {
        const res = await User.update({ status: 0 }, { where: { id } })
        return res[0] > 0 ? true : false
    }

    /**
     * 激活用户
     * @param {Number} id 
     */
    async activeUser(id) {
        const res = await User.update({ status: 1 }, { where: { id } })
        return res[0] > 0 ? true : false
    }

    /**
     * 分页获取用户信息(禁用用户)
     * @param {*}  
     */
    async getUserList({ current, size, username, role }) {
        // 分页
        const offset = (current - 1) * size
        const limit = size * 1

        // const whereOpt = { status: 1 }
        const whereOpt = {}
        role && Object.assign(whereOpt, {
            role: {
                [Op.eq]: role
            }
        })
        username && Object.assign(whereOpt, {
            username: {
                [Op.like]: `%${username}%`
            }
        })
        // Executing (default): SELECT count(*) AS `count` FROM `users` AS `user` WHERE `user`.`status` = 1 AND `user`.`role` = 2 AND `user`.`username` LIKE '%i%';
        // Executing (default): SELECT `id`, `username`, `role`, `avatar`, `status`, `created` FROM `users` AS `user` WHERE `user`.`status` = 1 AND `user`.`role` = 2 AND `user`.`username` LIKE '%i%' LIMIT 0, 1;
        const { count, rows } = await User.findAndCountAll({
            offset, limit, attributes: { exclude: ['password'] },
            where: whereOpt
        })

        return {
            // 当前页码  页码数量 总数  结果值
            current, size, total: count, list: rows
        }
    }

    /**
     * 统计用户数量
     */
    async getUserCount() {
        let res = await User.count({
            where: {
                status: 1
            }
        })
        return res
    }

    /**
     * 通过idList数组来查询用户信息
     * @param {Array} idList 
     */
    async getUserInfoByIdList(idList) {
        const res = await User.findAll({
            where: {
                id: idList
            },
            attributes: { exclude: ['password'] }
        })
        return res
    }
}

module.exports = new UserService()