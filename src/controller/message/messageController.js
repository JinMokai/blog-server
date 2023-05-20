const messageService = require("../../service/message/messageService")
const { R, ER, CODE } = require("../../result/R");
const errCode = CODE.MESSAGE

class messageController {
    /**
     * 添加留言
     * @param {*} ctx 
     */
    async addMessage(ctx) {
        const params = ctx.request.body
        try {
            const res = await messageService.addMessage(params)
            ctx.body = R("添加留言成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errCode, "添加留言失败"), ctx)
        }
    }

    /**
     * 后台分页获取留言
     * @param {*} ctx 
     */
    async getMessageList(ctx) {
        const { current, size } = ctx.request.body
        try {
            const res = await messageService.getMessageList(current, size)
            ctx.body = R("分页获取留言成功", res)
        } catch (err) {
            console.error("分页获取留言失败", err)
            return ctx.app.emit("error", ER("分页获取留言失败"), ctx)
        }
    }

    /**
     * 审核留言
     * @param {Promise} ctx 
     */
    async auditMessage(ctx) {
        const { messageId, status } = ctx.params
        try {
            const res = await messageService.auditMessage(messageId, status)
            ctx.body = R("审核留言成功", res)
        } catch (err) {
            console.error("审核留言失败", err)
            return ctx.app.emit("error", ER("审核留言失败"), ctx)
        }
    }

    /**
     * 删除留言
     * @param {*} ctx 
     */
    async deleteMessage(ctx) {
        const { id: messageId } = ctx.params
        try {
            const res = await messageService.deleteMessage(messageId)
            ctx.body = R("删除留言成功", res)
        } catch (err) {
            console.error("删除留言失败", err)
            return ctx.app.emit("error", ER("删除留言失败"), ctx)
        }
    }
}

module.exports = new messageController()