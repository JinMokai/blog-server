const Message = require("../../model/message/messageModel")
const moment = require("moment")
const {Op} = require("sequelize")

class messageService {
    /**
     * 添加留言
     * @param {*} param0 
     */
    async addMessage({ nickname, email, website, content }) {
        const res  = await Message.create({ nickname, email, website, content })
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
        console.log(res)
        return res.dataValues
    }
}

module.exports = new messageService()