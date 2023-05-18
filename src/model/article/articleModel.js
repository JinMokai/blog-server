const { Sequelize, DataTypes } = require("sequelize")

const seq = require("../../db/seq")
/**
 * 文章表
 */
const article = seq.define("article", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "文章ID"
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
        comment: "文章标题 不能为空 必填"
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
        comment: "文章描述 不能为空 必填"
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        require: true,
        comment: "文章内容 不能为空 必填"
    },
    article_cover: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "http://localhost:8888/cover.webp",
        comment: "文章缩略图 必填"
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        require: true,
        comment: "用户ID 不能为空 必填"
    },
    cat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        require: true,
        comment: "分类ID 不能为空 必填"
    },
    view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "文章访问次数 默认为0"
    },
    like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: "文章点赞次数 默认为0"
    },
    read_time: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: "文章阅读时长 默认为0"
    },
    type: {
        type: DataTypes.CHAR(1),
        defaultValue: 1,
        allowNull: false,
        comment: "文章类型：0 原创 1 转载 默认:0"
    },
    status: {
        type: DataTypes.CHAR(1),
        defaultValue: 1,
        allowNull: false,
        comment: "发布状态 0-草稿 1-发布 2- 私密 默认:1"
    },
    is_top: {
        type: DataTypes.CHAR(1),
        defaultValue: 1,
        allowNull: false,
        comment: "置顶文章 0-置顶 1-不置顶 默认:1"
    },
    created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'articles',
    timestamps: false
})
// article.sync({ alter: true });
console.log("文章模型表刚刚(重新)创建！");
module.exports = article