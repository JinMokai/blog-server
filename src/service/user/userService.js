const User = require("../../model/user/userModel")
const { Op } = require("sequelize");

class UserService {
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
        const whereOpt = {}
        id && Object.assign(whereOpt, { id })
        username && Object.assign(whereOpt, { username })
        password && Object.assign(whereOpt, { password })
        role && Object.assign(whereOpt, { role })

        const res = await User.findAll({
            attributes: { exclude: ['created'] },
            where: whereOpt
        })
        console.log(res.dataValues, '46')
        return res ? res.dataValues : null;
    }
}

module.exports = new UserService()