const { Sequelize, DataTypes } = require("sequelize")
const moment = require("moment")

const seq = require("../../db/seq")
/**
 * 留言表
 */
const Message = seq.define("message", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "id 主键 不为空"
    },
    nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "昵称 不为空"
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "邮箱 不为空"
    },
    webstite: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "网站地址"
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "留言内容"
    },
    status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 0,
        comment: "审核状态 0-未审核 1-已审核 不为空 默认为0"
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        get() {
            return moment(this.getDataValue("created")).format("YYYY-MM-DD HH:mm:ss")
        },
        set(value) {
            this.setDataValue("created", value)
        }
    },
    updated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        get() {
            return moment(this.getDataValue("updated")).format("YYYY-MM-DD HH:mm:ss")
        },
        set(value) {
            this.setDataValue("updated", value)
        }
    }
}, {
    tableName: 'messages',
    timestamps: false,
    hooks: {
        beforeCreate: (Message, options) => {
            // 每次插入更新时间
            Message.created = moment(Message.created).format("YYYY-MM-DD HH:mm:ss")
            Message.updated = moment(Message.updated).format("YYYY-MM-DD HH:mm:ss")
        }
    }
})
// Message.sync({ alter: true });
console.log("留言模型表刚刚(重新)创建！");

module.exports = Message