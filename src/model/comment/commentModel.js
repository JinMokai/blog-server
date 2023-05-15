const { Sequelize, DataTypes } = require("sequelize")

const seq = require("../../db/seq")
/**
 * 评论表
 */
const comment = seq.define("comment", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'categories',
    timestamps: false
})

await comment.sync({ force: true });
console.log("评论模型表刚刚(重新)创建！");

module.exports = comment