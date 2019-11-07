/**
 * Created by wenglibo on 2018/8/20.
 */

'use strict';

const Controller = require('egg').Controller;
const ms = require('ms');

class AccountController extends Controller {

  async login() {
    const { ctx } = this;
    const { account, password, remember_me } = ctx.request.body;
    const account_id = await ctx.service.accountService.login(account, password);
    ctx.session.account_id = account_id;
    ctx.session.maxAge = remember_me ? ms('30d') : ms('7d');
    ctx.success({ account_id });
  }

  async quit() {
    const { ctx } = this;
    ctx.session.uid = null;
    ctx.success({ret: true});
  }
}

module.exports = AccountController;