'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/rpc_feed_service.test.js', () => {

  let ctx = null;

  before(() => {
    ctx = app.mockContext();
  });

  it("proxy.FeedService.retryCrawling", async () => {
    const res = await ctx.proxy.feedService.retryCrawling({ mid: '4284117149173097' });
    assert(res.code === 200);
  });

});