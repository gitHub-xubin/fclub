'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/account.test.js', () => {
  const g_feed_id = 238;

  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it ('/v1/feed/top_one', () => {
    return app.httpRequest()
      .post('/v1/feed/top_one')
      .send({ feed_id: g_feed_id, opt: "1" })
      .expect(200)
      .then(response => {
        console.log("rets | ", JSON.stringify(response.body));
        //assert(response.body.data.account_id !== 0);
      });
  });

});
