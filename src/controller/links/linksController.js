const linksService = require("../../service/links/linksService")
const { R, ER, CODE } = require("../../result/R");
const errCode = CODE.LINKS

class linksController {
    /**
     * 添加和修改友链
     * @param {*} ctx 
     */
    async addOrUpdateLinks(ctx) {
        try {
            const { id } = ctx.request.body
            const res = await linksService.addOrUpdateLinks(ctx.request.body)
            const msg = id ? "修改" : "发布"
            ctx.body = R(`${msg}友链成功`, res)
        } catch (err) {
            console.log(`${msg}友链失败`, err)
            return ctx.app.emit("error", ER(errCode, `${msg}友链失败`), ctx)
        }
    }

    /**
     * 删除友链
     * @param {*} ctx 
     */
    async deleteLinks(ctx) {
        try {
            const { idList } = ctx.request.body;
            const res = await linksService.deleteLinks(idList);

            ctx.body = R("删除友链成功", res);
        } catch (err) {
            console.error(err);
            return ctx.app.emit("error", ER(errCode, "删除友链失败"), ctx);
        }
    }

    /**
     * 审核友链
     * @param {*} ctx 
     * @returns 
     */
    async approveLinks(ctx) {
        try {
            const { idList } = ctx.request.body;
            const res = await linksService.approveLinks(idList);

            ctx.body = R("审核友链成功", res);
        } catch (err) {
            console.error(err);
            return ctx.app.emit("error", ER(errCode, "审核友链失败"), ctx);
        }
    }

    /**
     * 分页获取友链
     * @param {*} ctx 
     */
    async getLinksList(ctx) {
        try {
            const { current, size, time, status, site_name } = ctx.request.body;
            const res = await linksService.getLinksList({ current, size, time, status, site_name });
            ctx.body = R("查询友链成功", res);
        } catch (err) {
            console.error(err);
            return ctx.app.emit("error", ER(errCode, "查询友链失败"), ctx);
        }
    }
}

module.exports = new linksController()