'use strict';
const Service = require('egg').Controller;

class PrivilegeService extends Service {
    get model() {
        return this.app.model.AdminPrivilege;
    }

    async getManagerIpList(admin_uid) {
        const list = await this.model.findAll({
            where: { account_id: admin_uid },
        });

        return list;
    }
}

module.exports = PrivilegeService;
