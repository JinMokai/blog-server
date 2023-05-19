const { Sequelize, DataTypes } = require("sequelize")
const moment = require("moment")

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
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        get() {
            return moment(this.getDataValue("created")).format("YYYY-MM-DD HH:mm:ss")
        },
        set(value) {
            this.setDataValue("created", value)
        }
    },
}, {
    tableName: 'categories',
    timestamps: false,
    hooks: {
        beforeCreate: (categary, options) => {
            // 每次插入更新时间
            categary.created = moment(categary.created).format("YYYY-MM-DD HH:mm:ss")
        }
    }
})
// categary.sync({ alter: true });
console.log("分类模型表刚刚(重新)创建！");
module.exports = categary