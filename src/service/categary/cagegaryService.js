const Categary = require("../../model/categary/categaryModel")
const { Op } = require("sequelize")

class categaryService {

    /**
     * 创建分类
     * @param {*} name 
     */
    async addCategary(name) {
        const res = await Categary.create({ name })
        return res.dataValues
    }

    /**
     * 查询分类信息
     * @param {Number} id 
     * @param {String} name 
     * @returns Object | null
     */
    async getCategaryOne({ name }) {
        const whereOpt = {}
        // @bug 可以考虑添加id来查询信息
        name && Object.assign(whereOpt, { name })
        const res = await Categary.findOne({
            attributes: { exclude: ['created'] },
            where: whereOpt
        })
        return res ? res.dataValues : null
    }

    /**
     * 修改分类名称
     * @param {Object} categary 
     */
    async updateCategary(categary) {
        const { id, name } = categary
        const res = await Categary.update({ name }, { where: { id } })
        // @bug 如果同名再删除就没意义了, 反而会导致统一返回结果中的res 变false(ch_kai: 理想状态每次删除都是true)
        return res[0] > 0 ? true : false
    }

    /**
     * 删除分类
     * @param {Array} idList 
     */
    async deleteCategary(idList) {
        const res = await Categary.destroy({
            where: {
                // or use Op
                id: idList
            }
        })
        return res
    }

    /**
     * 获取所有分类
     */
    async getCategaryAll() {
        const res = await Categary.findAll({
            attributes: ['id', 'name']
        })
        return res
    }

    /**
     * 条件分页查找分页列表
     */
    async getCategaryList({ current, size, name }) {
        const whereOpt = {}
        const offset = (current - 1) * size
        const limit = size * 1

        name && Object.assign(whereOpt, {
            name: {
                // 模糊查询
                [Op.like]: `%${name}%`
            }
        })
        const { count, rows } = await Categary.findAndCountAll({
            where: whereOpt,
            offset,
            limit
        })
        return {
            // 当前页码  页码数量 总数  结果值
            current, size, total: count, list: rows
        }
    }

    /**
     * 通过id来获取分类名称
     * @param {Number} current 
     * @param {Number} size 
     */
    async getCategaryNameById(id) {
        const res = await Categary.findOne({
            attributes: ['name'],
            where: { id }
        })
        return res.dataValues
    }

    /**
     * 获取分类总数
     */
    async getCategaryCount() {
        let res = Categary.count()
        return res
    }
}

module.exports = new categaryService()