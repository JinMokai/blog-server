const { where } = require("sequelize");
const { Op } = require("sequelize")
const Links = require("../../model/links/linksModel")
const moment = require("moment")

class linksService {
    /**
   * 新增/编辑友链
   */
    async addOrUpdateLinks({ id, site_name, site_desc, site_avatar, url }) {
        let res;
        if (id) {
            res = await Links.update(
                { site_name, site_desc, site_avatar, url },
                {
                    where: {
                        id,
                    },
                }
            );
            // 编辑完成后的同时更新时间
            await Links.update({ updated: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") }, {
                where: {
                    id
                }
            })
        } else {
            res = await Links.create({ site_name, site_desc, site_avatar, url, status: 0 });
        }

        return res ? true : false;
    }

    /**
     * 删除友链
     */
    async deleteLinks(idList) {
        let res = await Links.destroy({
            where: {
                id: idList,
            },
        });

        return res ? res : null;
    }

    /**
    * 批量审核友链
    * @param {*} idList
    * @returns
    */
    async approveLinks(idList) {
        let res = await Links.update(
            { status: 1 },
            {
                where: {
                    id: idList,
                },
            }
        );

        return res ? res : null;
    }

    /**
    * 分页获取友链信息
    * @param {Object} param0 分页、筛选条件参数
    * @param {number} param0.current 当前页码
    * @param {number} param0.size 每页显示数量
    * @param {Array} param0.time 时间范围，如：['2022-01-01 00:00:00', '2022-06-01 00:00:00']
    * @param {string} param0.status 友链状态，可选值：'pass'、'reject'、'pending'
    * @param {string} param0.site_name 友链名称，可作为查询关键字
    * @returns {Object} 包含当前页码（current）、每页显示数量（size）、友链列表（list）和总数（total）的对象
    */
    async getLinksList({ current, size, time, status, site_name }) {
        const offset = (current - 1) * size;
        const limit = size * 1;
        const whereOpt = {};
        site_name &&
            Object.assign(whereOpt, {
                site_name: {
                    [Op.like]: `%${site_name}%`,
                },
            });
        status &&
            Object.assign(whereOpt, {
                status,
            });
        time &&
            Object.assign(whereOpt, {
                created: {
                    // [Op.between]: [6, 10],       // BETWEEN 6 AND 10
                    [Op.between]: time,
                },
            });
        const { rows, count } = await Links.findAndCountAll({
            limit,
            offset,
            where: whereOpt,
            order: [["created", "ASC"]],
        });

        return {
            current,
            size,
            list: rows,
            total: count,
        };
    }
}

module.exports = new linksService()
