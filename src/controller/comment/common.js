/**
 * 这是一个评论的公共方法
 * @author ch_kai
 */
const userService = require("../../service/user/userService")
const articleService = require("../../service/article/articleService")

/**
 * 通过Comment表user_id字段获取用户信息
 * @param {Array} idList
 */
const getUserInfoByComment = async (idList) => {
    const res = await userService.getUserInfoByIdList(idList)
    return res
}

/**
 * 通过comment表article字段获取信息
 * @param {Array} idList 
 * @returns 
 */
const getArticleTitle = async (idList) => {
    const res = await articleService.getArticleTitleByIds(idList)
    return res
}

module.exports = {
    getUserInfoByComment,
    getArticleTitle
}