const categaryService = require("../../service/categary/cagegaryService")
const { R, ER, CODE } = require("../../result/R")
const errcode = CODE.CATEGARY

class categaryController {
    /**
     * 创建分类
     * @param {*} ctx 
     */
    async addCategary(ctx) {
        const { name } = ctx.request.body
        try {
            const res = await categaryService.addCategary(name)
            ctx.body = R("创建分类成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "创建分类失败"), ctx)
        }
    }

    /**
     * 修改分类
     * @param {*} ctx 
     */
    async updateCategary(ctx) {
        const { id, name } = ctx.request.body
        try {
            const res = await categaryService.updateCategary({ id, name })
            ctx.body = R("修改分类成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "修改分类失败"), ctx)
        }
    }

    /**
    * 删除分类
    * @param {*} ctx 
    */
    async deleteCategary(ctx) {
        const { idList } = ctx.request.body
        try {
            const res = await categaryService.deleteCategary(idList)
            ctx.body = R("删除分类成功", {
                deleteCount: res
            })
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "删除分类失败"), ctx)
        }
    }

    /**
     * 查询所有分类
     * @param {*} ctx 
     */
    async getCategaryAll(ctx) {
        try {
            const res = await categaryService.getCategaryAll()
            ctx.body = R("获取分类成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "获取所有分类失败"), ctx)
        }
    }

    /**
     * 条件分页查找分页列表
     * @param {*} ctx 
     */
    async getCategaryList(ctx) {
        try {
            // 当前页 页数 分类名
            const { current, size, name } = ctx.request.body
            const res = await categaryService.getCategaryList({ current, size, name })
            ctx.body = R("分页查询成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errcode, "分页查询失败"), ctx)
        }
    }

    /**
     * 通过id来获取分类名称
     */
    async getCategaryNameById(id) {
        try {
            // const { id } = ctx.params
            const res = await categaryService.getCategaryNameById(id)
            // ctx.body = R("获取分类成功", res)
            return res
        } catch (err) {
            console.error("获取分类名称错误")
            return ctx.app.emit("error", ER(errcode, "获取分类名称错误"), ctx)
        }
    }
}

module.exports = new categaryController()