const Comment = require("../../model/comment/commentModel")
const { Op, where } = require("sequelize");

class commentService {
    /**
     * 新增评论
     * @param {Number} user_id 评论者id
     * @param {String} content 评论内容
     * @param {Number} article_id 文章id
     */
    async addComment(user_id, content, article_id) {
        const res = await Comment.create({ user_id, article_id, content })
        return res.dataValues
    }

    /**
     * 批量删除评论
     * @param {Number} id 
     */
    async backdelete(idList) {
        const res = await Comment.destroy({ where: { id: idList } })
        console.log(res)
        return res
    }

    /**
     * 后台分页获取评论
     * @param {Number} current - 当前页码
     * @param {Number} size - 每页数据条数
     * @param {Number} article_id 文章id
     * @returns 
     */
    async backGetCommentList(current, size, article_id) {
        const offset = (current - 1) * size
        const limit = size * 1
        const whereOpt = {}
        article_id && Object.assign(whereOpt, { article_id })
        const { count, rows } = await Comment.findAndCountAll({
            offset, limit,
            where: whereOpt
        })
        return {
            current,
            size,
            list: rows,
            total: count
        }
    }

    /**
     * 根据文章id获取对应评论用户信息
     * @param {Number} id 
     */
    async getArticleCommentUserInfo(id) {
        const user_id = await Comment.findAll({
            where: {
                article_id: id
            },
            attributes: ['user_id']
        })
        const userArr = user_id.map(item => item.user_id)
        return userArr
    }

    /**
     * 通过文章id获取评论信息
     * @param {Number} id 
     */
    async getCommentInfoById(id) {
        const info = await Comment.findAll({
            where: {
                article_id: id
            },
            attributes: ['content', 'created', 'user_id']
        })
        return info
    }

    /**
     * 获取所有有评论的文章列表
     */
    async getCommentArticle() {
        let articleIds = await Comment.findAll({
            attributes: ['article_id'],
            group: ['article_id']
        })
        let ids = articleIds.map(item => item.article_id)
        return ids
    }
}

module.exports = new commentService()