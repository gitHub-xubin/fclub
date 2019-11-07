/**
 * Created by wenglibo on 2018/8/21.
 */

"use strict";

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/feeds_service.test.js', () => {

  let ctx = null;
  const g_ip_id = 1000;
  const g_feed_id = 238;

  before(() => {
    ctx = app.mockContext();
  });

  it('adminFeedsService.topOne', async () => {
    const adminFeedService = ctx.service.adminFeedsService;
    {
      const ret = await adminFeedService.topOne(g_feed_id, 1);
      const feed = await adminFeedService.feedModel.findOne({
        where: {
          id: g_feed_id
        },
        raw: true,
      });
      //assert(ret);
      assert(feed.is_top_home === 1);
    }

    {
      const ret = await adminFeedService.topOne(g_feed_id, 0);
      const feed = await adminFeedService.feedModel.findOne({
        where: {
          id: g_feed_id
        }
      });
      assert(ret);
      assert(feed.is_top_home === 0);
    }
  });

  it('adminFeedsService.pushToIPHostPage', async () => {
    const adminFeedService = ctx.service.adminFeedsService;
    {
      const ret = await adminFeedService.pushToIPHostPage(g_feed_id, 1);
      const feed = await adminFeedService.feedModel.findOne({
        where: {
          id: g_feed_id
        },
        raw: true,
      });
      assert(feed.recommend_state === 2);
    }

    {
      const ret = await adminFeedService.pushToIPHostPage(g_feed_id, 0);
      const feed = await adminFeedService.feedModel.findOne({
        where: {
          id: g_feed_id
        }
      });
      assert(feed.recommend_state === 1);
    }
  });


  it ("adminFeedsService.queryFeedsFromBackstage", async () => {
    let ret = await ctx.service.adminFeedsService.queryFeedsFromBackstage(g_ip_id, 1, {});
    console.log("ret: ", JSON.stringify(ret));
    assert(ret.counts > 0 && ret.feeds.length > 0);

    ret = await ctx.service.adminFeedsService.queryFeedsFromBackstage(g_ip_id, 2, {});
    console.log("ret: ", JSON.stringify(ret));
    assert(ret.counts > 0 && ret.feeds.length > 0);

    ret = await ctx.service.adminFeedsService.queryFeedsFromBackstage(g_ip_id, 3, {});
    console.log("ret: ", JSON.stringify(ret));
    assert(ret.counts > 0 && ret.feeds.length > 0);

    ret = await ctx.service.adminFeedsService.queryFeedsFromBackstage(g_ip_id, 4, {});
    console.log("ret: ", JSON.stringify(ret));
    assert(ret.counts > 0 && ret.feeds.length > 0);
  });

  it("adminFeedsService.search", async () => {
    {
      let ret = await ctx.service.adminFeedsService.search("a", "", {});
      console.log("ret: ", JSON.stringify(ret));
      assert(ret.counts > 0 && ret.feeds.length > 0);
    }

    {
      let ret = await ctx.service.adminFeedsService.search("", "1", {});
      console.log("ret: ", JSON.stringify(ret));
      assert(ret.counts > 0 && ret.feeds.length > 0);
    }
  });

  it.only("adminFeedsService.resourceRecrawl", async () => {
    const ret = await ctx.service.adminFeedsService.resourceRecrawl(1841);
    console.log("ret", ret);
    assert(ret.resultCode === 200);
  });

});