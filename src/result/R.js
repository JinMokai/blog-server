/**
 * 这是一个结果返回公共函数
 */

// 返回状态码
const CODE = {
    NOTFOUNT: 404, // 没有找到状态码
    USER: 1001, // 用户状态码
    AUTH: 1002, // 权限认证状态码
    CATEGARY: 1003, // 分类状态码
    ARTICLE: 1004, // 文章状态码
    COMMENT: 1005, // 评论状态码
    MESSAGE: 1006 // 留言状态码
}
/**
 * 返回成功结果
 * @param {string} message 
 * @param {Object} result 
 * @returns Object
 */
function R(message, result) {
    return {
        code: 0,
        message,
        result
    }
}

/**
 * 返回错误结果
 * @param {number} code
 * @param {string} message 
 * @returns Object 
 */
function ER(code, message) {
    return {
        code,
        message
    }
}

module.exports = {
    R, ER, CODE
}