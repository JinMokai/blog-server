const Message = require("../../model/message/messageModel")
const moment = require("moment")
const { Op, MEDIUMINT } = require("sequelize")

class messageService {
    /**
     * 添加留言
     * @param {*} param0 
     */
    async addMessage({ nickname, email, website, content }) {
        const res = await Message.create({ nickname, email, website, content })
        // 更新时间
        // res结果 message {
        //     dataValues: {
        //       status: 0,
        //       created: '2023-05-19 22:05:51',
        //       updated: '2023-05-19 22:05:51',
        //       id: 1,
        //       nickname: 'ch_kai',
        //       email: '23@qq.com',
        //       content: '这是留言'
        //     }
        // ...
        //   }
        // await Article.update({ updated: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") }, { where: { id: article.id } })
        // console.log(res)
        return res.dataValues
    }

    /**
     * 分页获取留言
     * @param {Number} current 
     * @param {Number} size 
     */
    async getMessageList(current, size) {
        const offset = (current - 1) * size
        const limit = size * 1
        const { count, rows } = await Message.findAndCountAll({
            offset, limit
        })
        return {
            current,
            size,
            list: rows,
            total: count
        }
    }

    /**
     * 审核留言
     * @param {Number} messageId 
     */
    async auditMessage(messageId, status) {
        const res = await Message.update({ status }, { where: { id: messageId } })
        // 更改更新时间 @bug
        await Message.update({ updated: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") }, { where: { id: messageId } })
        return res[0] > 0 ? true : false
    }

    /**
     * 删除留言
     * @param {Number} messageId 
     * @returns Boolean 
     */
    async deleteMessage(messageId) {
        const res = await Message.destroy({ where: { id: messageId } })
        return res ? true : false
    }

    /**
     * 统计未处理留言
     */
    async getMessageCount() {
        let res = await Message.count({
            where: {
                status: 0
            }
        })
        return res
    }
}

module.exports = new messageService()