/**
 * 这是一个评论的公共方法
 * @author ch_kai
 */
const userService = require("../../service/user/userService")

/**
 * 通过Comment表user_id字段获取用户信息
 * @param {Array} idList
 */
const getUserInfoByComment = async (idList) => {
    const res = await userService.getUserInfoByIdList(idList)
    return res
}

module.exports = {
    getUserInfoByComment
}