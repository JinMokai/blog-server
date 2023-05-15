/**
 * 这是一个结果返回公共函数
 */

// 返回状态码
const CODE = {
    NOTFOUNT: 404,
    USER: 1001,
    AUTH: 1002
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