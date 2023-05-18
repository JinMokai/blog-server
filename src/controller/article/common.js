// 这是一个公共方法
const categaryService = require("../../service/categary/cagegaryService")

/**
 * 文章里面包含分类创建
 * @param {*} name 
 * @returns 分类id
 */
const createCategoryAndArticle = async (name) => {
    let cid;
    // 判断分类是否存在
    const catFlag = await categaryService.getCategaryOne({ name })
    if (catFlag) {
        // 存在就返回分类id 并返回给cid
        cid = catFlag.id
    } else {
        // 不存在就创建 并返回分类id
        const r = await categaryService.addCategary(name)
        cid = r.id
    }
    return cid
}

module.exports = {
    createCategoryAndArticle
}