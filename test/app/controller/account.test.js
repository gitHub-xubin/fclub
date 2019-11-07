'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/account.test.js', () => {

  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it ('/v1/account/login', () => {
    return app.httpRequest()
      .post('/v1/account/login')
      .send({ account: "userabc", password: "123456" })
      .expect(200)
      .then(response => {
        console.log("rets | ", JSON.stringify(response.body));
        assert(response.body.data.account_id !== 0);
      });
  });

});
