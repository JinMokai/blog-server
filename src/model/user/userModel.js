const { Sequelize, DataTypes } = require("sequelize")

const seq = require("../../db/seq")

/**
 * 用户表
 */
const User = seq.define("user", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 2,
        comment: "用户角色 1 管理员 2 普通用户",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "http://localhost/8888/default.png",
      comment: "用户头像",
    },
    status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 1,
        comment: "是否禁用用户: 0 表示禁用 1 表示不禁用"
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
    tableName: 'users',
    timestamps: false,
    hooks: {
        beforeCreate: (User, options) => {
            // 每次插入更新时间
            User.created = moment(User.created).format("YYYY-MM-DD HH:mm:ss")
        }
    }
})

// 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等)
// User.sync({ alter: true });
console.log("用户模型表刚刚(重新)创建！");

module.exports = User