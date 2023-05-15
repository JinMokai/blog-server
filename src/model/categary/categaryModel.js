const { Sequelize, DataTypes } = require("sequelize")

const seq = require("../../db/seq")
/**
 * 分类表
 */
const categary = seq.define("categary", {
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
await categary.sync({ force: true });
console.log("分类模型表刚刚(重新)创建！");
module.exports = categary