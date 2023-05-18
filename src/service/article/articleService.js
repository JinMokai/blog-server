const Article = require("../../model/article/articleModel")
const { Op, where } = require("sequelize")

class articleService {
    /**
     * 新增文章
     */
    async createArticle(article) {
        let res
        try {
            res = await Article.create(article)
        } catch (err) {
            console.error(err)
        }
        return res ? res.dataValues : null
    }

    /**
     * 文章查询
     * @param {Object} param
     * @returns {Boolean} true | false
     */
    async getOneArticleInfoByTitle({ title, id }) {
        let res = await Article.findOne({
            attributes: ['id'],
            where: { title }
        })
        if (res) {
            if (id) {
                // 如果传入参数有id且等于文章的id返回false
                res = res.dataValues.id != id ? true : false
            } else {
                res = true
            }
        } else {
            res = false
        }
        return res
    }

    /**
     * 文章修改
     */
    async updateArticle(article) {
        let res
        try {
            res = await Article.update(article, { where: { id: article.id } })
        } catch (err) {
            console.error(err)
        }
        console.log(res)
        return res[0] > 0 ? true : false
    }

    /**
     * 修改文章置顶
     */
    async updateTop(id, isTop) {
        const res = await Article.update({ is_top: isTop }, { where: { id } })
        // @bug 如果权限未修改 还操作数据库 这是不严谨操作
        return res[0] > 0 ? true : false
    }

    /**
     * 删除文章
     * 0 永久删除 1,2 回收站
     */
    async deleteArticle(id, status) {
        if (Number(status) !== 0) {
            // 将文章状态变成草稿
            const res = await Article.update({ status: 0 }, { where: { id } })
            return res[0] > 0 ? true : false
        } else {
            const res = await Article.destroy({
                where: { id }
            })
            return res
        }
    }

    /**
     * 更改文章状态
     * @param {Number} id 
     * @param {Number} status 
     * @requires Boolean
     */
    async updateStatus(id, status) {
        const res = await Article.update({ status }, { where: { id } })
        // @bug 上面删除 更改恢复 可以考虑多选
        return res[0] > 0 ? true : false
    }

    /**
     * 恢复文章 
     * @param {Number} id 
     * @description 主要功能是将草稿箱文章恢复到发布状态
     */
    async revertArticle(id) {
        const res = await Article.update({ status: 1 }, { where: { id } })
        return res[0] > 0 ? true : false
    }

    /**
     * 分页获取文章
     * @param {*} params 
     */
    async getArticleList(params) {
        // 当前页 分页大小 文章标题 状态 是否置顶 分类id 创建时间
        const { current, size, title, status, is_top, cat_id, created } = params
        const offset = (current - 1) * size
        const limit = size * 1
        const whereOpt = {}
        title && Object.assign(whereOpt, {
            title: {
                [Op.like]: `%${title}%`
            }
        })
        created && Object.assign(whereOpt, {
            created: {
                [Op.between]: created
            }
        })
        is_top && Object.assign(whereOpt, { is_top })
        status && Object.assign(whereOpt, { status })
        !status && Object.assign(whereOpt, { status: [1, 2] })
        cat_id && Object.assign(whereOpt, { cat_id })

        const { count, rows } = await Article.findAndCountAll({
            offset, limit, where: whereOpt, attributes: { exclude: ['content', 'updated', 'article_cover'] },
            order: [['created', 'DESC']]
        })

        return {
            current,
            size,
            list: rows,
            total: count
        }
    }
}

module.exports = new articleService()