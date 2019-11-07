'use strict';

const Controller = require('egg').Controller;

class PrivilegeController extends Controller {
    async ipList() {
        const { ctx } = this;
        const { uid, service: { privilegeService } } = ctx;

        const list = await privilegeService.getManagerIpList(uid);

        ctx.success(list);
    }
}

module.exports = PrivilegeController;
