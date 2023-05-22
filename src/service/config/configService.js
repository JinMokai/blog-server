const { where } = require("sequelize");
const { Op } = require("sequelize")
const Config = require("../../model/config/configModel")
const moment = require("moment")

class configService {
    /**
     * 更改网站设备
     * @param {Promise} config 
     * @returns 
     */
    async updateConfig(config) {
        const { id } = config;
        let one = await Config.findByPk(id);

        let res;
        if (one) {
            res = await Config.update(config, {
                where: {
                    id,
                },
            });
        } else {
            res = await Config.create(config);
        }

        return res ? true : false;
    }

    /**
     * 获取网站配置
     */
    async getConfig() {
        let res = await Config.findByPk(1);

        return res ? res : null;
    }

    /**
     * 增加网站访问量
     * @returns 
     */
    async addView() {
        let config = await Config.findByPk(1);
        let res = config.increment(["view_count"], { by: 1 });

        return res ? true : false;
    }

    /**
     * 统计网站访问量
     */
    async getViewCount() {
        let res = await Config.findOne({
            attributes: ['view_count'],
            where: {
                id: 1
            }
        })
        return res
    }
}

module.exports = new configService()
