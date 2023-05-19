const { Sequelize, DataTypes } = require("sequelize")
const moment = require("moment")

const seq = require("../../db/seq")
/**
 * 评论表
 */
const Comment = seq.define("comment", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "评论ID"
    },
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "文章ID"
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "用户ID"

    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "评论内容"
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: "创建时间",
        get() {
            return moment(this.getDataValue("created")).format("YYYY-MM-DD HH:mm:ss")
        },
        set(value) {
            this.setDataValue("created", value)
        }
    },
}, {
    tableName: 'comment',
    timestamps: false,
    hooks: {
        beforeCreate: (Comment, options) => {
            // 每次插入更新时间
            Comment.created = moment(Comment.created).format("YYYY-MM-DD HH:mm:ss")
        }
    }
})
// Comment.sync({ alter: true });
console.log("评论模型表刚刚(重新)创建！");

module.exports = Comment