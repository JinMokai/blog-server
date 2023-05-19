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
}

module.exports = new messageController()