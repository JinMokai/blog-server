const { DataTypes } = require("sequelize")
const { Sequelize } = require("sequelize")
var moment = require("moment")

const seq = require("../../db/seq")

const Config = seq.define(
    "config",
    {
        blog_name: {
            type: DataTypes.STRING(55),
            require: true,
            comment: "博客名称",
            defaultValue: "ch_kai的博客",
        },
        blog_avatar: {
            type: DataTypes.STRING, // STRING 默认255
            require: true,
            comment: "博客头像",
            defaultValue: "http://localhost:8888/default.png",
        },
        personal_say: {
            type: DataTypes.STRING,
            require: true,
            comment: "个人签名",
        },
        blog_notice: {
            type: DataTypes.STRING,
            require: true,
            comment: "博客公告",
        },
        github_link: {
            type: DataTypes.STRING,
            require: true,
            comment: "github链接",
        },
        gitee_link: {
            type: DataTypes.STRING,
            require: true,
            comment: "gitee链接",
        },
        view_count: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            require: true,
            comment: "博客被访问的次数",
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
        updated: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            comment: "更新时间",
            get() {
                return moment(this.getDataValue("updated")).format("YYYY-MM-DD HH:mm:ss")
            },
            set(value) {
                this.setDataValue("updated", value)
            }
        },
    },
    {
        tableName: 'config',
        timestamps: false,
        hooks: {
            beforeCreate: (Config, options) => {
                // 每次插入更新时间
                Config.created = moment(Config.created).format("YYYY-MM-DD HH:mm:ss")
                Config.updated = moment(Config.updated).format("YYYY-MM-DD HH:mm:ss")
            }
        }
    }
)

// Config.sync({ alter: true }) //同步数据表
console.log("网站配置模型表刚刚(重新)创建！");

module.exports = Config
