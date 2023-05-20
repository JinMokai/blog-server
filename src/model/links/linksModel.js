const { Sequelize, DataTypes } = require("sequelize")
const moment = require("moment")

const seq = require("../../db/seq")
/**
 * 友链表
 */
const Links = seq.define("links", {
    site_name: {
        type: DataTypes.STRING(55),
        require: true,
        allowNull: false,
        comment: "网站名称",
    },
    site_desc: {
        type: DataTypes.STRING, // STRING 默认255
        require: true,
        allowNull: false,
        comment: "网站描述",
    },
    site_avatar: {
        type: DataTypes.STRING(555), // STRING 默认255
        defaultValue: "http://localhost:8888/cover.webp",
        allowNull: true,
        comment: "网站头像",
    },
    url: {
        type: DataTypes.STRING, // STRING 默认255
        require: true,
        allowNull: false,
        comment: "网站地址",
    },
    status: {
        type: DataTypes.INTEGER, // STRING 默认255
        defaultValue: 0,
        allowNull: false,
        require: true,
        comment: "审核状态 0 待审核 1 审核通过 默认为0 不为空",
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: "创建时间",
        get() {
            return moment(this.getDataValue("created")).format("YYYY-MM-DD HH:mm:ss");
        },
        set(value) {
            this.setDataValue("created", value)
        }
    },
    updated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: "更新时间",
        get() {
            return moment(this.getDataValue("updated")).format("YYYY-MM-DD HH:mm:ss");
        },
        set(value) {
            this.setDataValue("updated", value)
        }
    },
}, {
    tableName: 'links',
    timestamps: false,
    hooks: {
        beforeCreate: (Links, options) => {
            // 每次插入更新时间
            Links.created = moment(Links.created).format("YYYY-MM-DD HH:mm:ss")
            Links.updated = moment(Links.updated).format("YYYY-MM-DD HH:mm:ss")
        }
    }
})
// Links.sync({ alter: true });
console.log("友链模型表刚刚(重新)创建！");

module.exports = Links