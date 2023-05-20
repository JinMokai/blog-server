const configService = require("../../service/config/configService")
const { R, ER, CODE } = require("../../result/R");
const errCode = CODE.CONFIG

class configController {
    /**
     * 更改网站配置
     */
    async updateConfig(ctx) {
        try {
            let res = await configService.updateConfig(ctx.request.body)
            ctx.body = R("修改网站设置成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errCode, "修改网站设置失败"))
        }
    }

    /**
     * 获取完整配置
     */
    async getConfig(ctx) {
        try {
            let res = await configService.getConfig()
            ctx.body = R("获取网站设置成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errCode, "获取网站设置失败"))
        }
    }

    /**
     * 修改网站访问次数
     * @param {*} ctx 
     */
    async addView(ctx) {
        try {
            let res = await configService.addView()
            ctx.body = R("增加访问量成功", res)
        } catch (err) {
            console.error(err)
            return ctx.app.emit("error", ER(errCode, "增加网站访问量失败"))
        }
    }
}

module.exports = new configController()