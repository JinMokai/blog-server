const moment = require("moment")
const Article = require("../../model/article/articleModel")
const { getCategaryNameById } = require("../../controller/categary/categaryController")
const { getUserNameById } = require("../../controller/user/userController")
const { Op, where } = require("sequelize")
const sequelize = require("../../db/seq")

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
     * 后台通过id获取文章信息
     * @param {Number} id 
     * @returns 
     */
    async BackgetArticleById(id) {
        let article = await Article.findByPk(id)
        // 通过分类id获取分类名称
        const catName = await getCategaryNameById(article.cat_id)
        // 获取文章作者
        const username = await getUserNameById(article.user_id)

        if (article) {
            Object.assign(article.dataValues, { category: catName.name, author_name: username.username })
        }
        return article
    }
    /**
     * 文章修改
     */
    async updateArticle(article) {
        let res
        try {
            res = await Article.update(article, { where: { id: article.id } })
            // 每次文章修改 都更新时间
            await Article.update({ updated: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") }, { where: { id: article.id } })
        } catch (err) {
            console.error(err)
        }
        console.log(res, 'updateArticle ch_kai:')
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
        // 使用promiseList来接受分类名称
        let promiseList = []
        promiseList = rows.map(async v => {
            // @bug 可以考虑优化
            let obj = {
                categaryName: await getCategaryNameById(v.dataValues.cat_id),
            }
            return obj
        })

        await Promise.all(promiseList).then(res => {
            if (res.length) {
                rows.forEach((v, i) => {
                    v.dataValues.categaryName = res[i].categaryName.name
                })
            }
        })

        return {
            current,
            size,
            list: rows,
            total: count
        }
    }

    /**
     * 分页前台获取文章(置顶和时间倒序)
     * @param {Number} current 当前页
     * @param {Number} size 页数
     */
    async homeGetArticleList(current, size) {
        const offset = (current - 1) * size
        const limit = size * 1

        const { count, rows } = await Article.findAndCountAll({
            order: [
                ['is_top', 'ASC'],
                ['created', 'DESC']
            ],
            limit, offset, attributes: { exclude: ['content', 'article_cover'] }, where: { status: 1 }
        })
        // 使用promiseList来接受分类名称
        let promiseList = []
        promiseList = rows.map(async v => {
            // @bug 可以考虑优化
            let obj = {
                categaryName: await getCategaryNameById(v.dataValues.cat_id),
            }
            return obj
        })
        await Promise.all(promiseList).then(res => {
            if (res.length) {
                rows.forEach((v, i) => {
                    v.dataValues.categaryName = res[i].categaryName.name
                })
            }
        })

        return {
            current,
            size,
            list: rows,
            total: count
        }
    }

    /**
    * 通过分类 ID 分页获取前台文章信息
    *
    * @param {Object} options - 参数对象
    * @param {number} options.current - 当前页码（从 1 开始）
    * @param {number} options.size - 每页数据条数
    * @param {number} options.cat_id - 文章所属分类 ID
    * @returns {Promise<Object>} 返回一个 Promise，包含以下字段：
    * - {number} current - 当前页码（同输入参数）
    * - {number} size - 每页数据条数（同输入参数）
    * - {Array.<Object>} list - 文章信息列表
    * - {number} total - 所有符合条件的文章数量
    */
    async homeGetArticleByCatId({ current, size, cat_id }) {
        const offset = (current - 1) * size
        const limit = size * 1
        // count: 总数 rows 各文章信息
        const { count, rows } = await Article.findAndCountAll({
            limit, offset,
            order: [['created', 'DESC']],
            where: {
                cat_id, status: 1
            },
            attributes: ["id", "title", "article_cover", "created"]
        })

        return {
            current,
            size,
            list: rows,
            total: count
        }
    }

    /**
    * 通过文章 ID 获取其相邻文章的信息
    *
    * @param {number} articleID - 文章 ID
    * @returns {Promise<Object>} 返回一个 Promise，包含以下字段：
    * - {Object} contentPrevious - 上一篇文章的信息（如果不存在，则为当前文章）
    *   - {number} id - 上一篇文章的 ID
    *   - {string} title - 上一篇文章的标题
    * - {Object} contentNext - 下一篇文章的信息（如果不存在，则为当前文章）
    *   - {number} id - 下一篇文章的 ID
    *   - {string} title - 下一篇文章的标题
    */
    async getRecommendArticleById(articleID) {
        // 上一篇文章
        let contentPrevious = await Article.findOne({
            where: {
                id: {
                    [Op.lt]: articleID
                },
                status: 1
            },
            attributes: ["id", "title"],
            order: [["id", "DESC"]]
        })

        // 下一篇文章
        let contentNext = await Article.findOne({
            where: {
                id: {
                    [Op.gt]: articleID
                },
                status: 1
            },
            attributes: ["id", "title"],
            order: [["id", "ASC"]]
        })
        // 如果上一篇文章不存在 用当前页面表示
        if (!contentPrevious) {
            contentPrevious = await Article.findOne({
                where: {
                    id: {
                        [Op.eq]: articleID
                    },
                    status: 1
                },
                attributes: ["id", "title"],
                order: [["id", "ASC"]]
            })
        }

        // 如果下一篇文章不存在 用当前页面表示
        if (!contentNext) {
            contentNext = await Article.findOne({
                where: {
                    id: {
                        [Op.eq]: articleID
                    },
                    status: 1
                },
                attributes: ["id", "title"],
                order: [["id", "ASC"]]
            })
        }

        return {
            contentPrevious,
            contentNext
        }

    }

    // 获取热门文章 获取前五个 通过访问次数来确定
    async getHotArticle() {
        const res = await Article.findAll({
            where: {
                status: 1
            },
            limit: 5,
            attributes: ["id", "title", "view_count"],
            order: [["view_count", "DESC"]]
        })
        return res
    }

    /**
     * 获取文章信息
     */
    async getArticleById(id) {
        let article = await Article.findByPk(id)
        if (article) {
            // 前端访问这个 浏览量+1
            await article.increment({ view_count: 1 })
        }
        // 通过分类id获取分类名称
        const catName = await getCategaryNameById(article.cat_id)
        // 获取文章作者
        const username = await getUserNameById(article.user_id)

        if (article) {
            Object.assign(article.dataValues, { cat_name: catName.name, author_name: username.username })
        }
        return article
    }

    /**
     * 文章点赞
     * @param {Number} id 
     */
    async articleThumbsUp(id) {
        let article = await Article.findByPk(id)
        if (article) {
            await article.increment({ like_count: 1 })
            return true
        } else {
            // @bug 对控制层来说  这里传入false是不合规矩的
            return false
        }
    }

    /**
     * 获取发布文章数量
     */
    async getArticleCount() {
        let res = await Article.count({
            status: 1
        })
        return res
    }

    /**
     * 统计每年文章的数量
     */
    async getArticleYearCount() {
        const res = await Article.findAll({
            attributes: [
                [sequelize.fn('YEAR', sequelize.col('created')), 'year'],
                [sequelize.fn('COUNT', '*'), 'article_count'],
            ],
            group: [sequelize.fn('YEAR', sequelize.col('created'))],
            order: [[sequelize.fn('YEAR', sequelize.col('created')), 'DESC']],
        });
        return res
    }
}

module.exports = new articleService()