/**
 * Created by wenglibo on 2018/8/21.
 */

"use strict";

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/account_service.test.js', () => {

  let ctx;
  let account_id = 0;
  const user_name = "userabc1";
  const password = "123456";

  before(() => {
    ctx = app.mockContext();
  });

  it('AccountService.register', async () => {
    account_id = await ctx.service.accountService.register(user_name, password, 1);
    assert(account_id !== 0);
  });

  it('AccountService.login', async () => {
    const login_account_id = await ctx.service.accountService.login(user_name, password);
    assert(account_id === login_account_id);
  });

});