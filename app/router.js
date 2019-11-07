'use strict';

const _ = require("underscore");
const { CustomError } = require("./lib/custom_error");
const ErrorCode = require('./const/error_code');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  async function authenticate(ctx, next) {
    const { account_id } = ctx.session;
    if (_.isNull(account_id) || _.isUndefined(account_id)) {
      throw new CustomError('请先登录', ErrorCode.NotLogin);
    }
    await next();
  }

  router.post('/v1/account/login', controller.account.login);
  router.post('/v1/account/quit', controller.account.quit);
  router.post('/v1/feed/delete_feed', authenticate, controller.feeds.destroyOne);
  router.post('/v1/feed/top_one', authenticate, controller.feeds.topOne);
  router.post('/v1/feed/resource_recrawl', authenticate, controller.feeds.resourceRecrawl);
  router.post('/v1/feed/push_to_hostpage', authenticate, controller.feeds.pushToIPHostPage);
  router.get('/v1/feed/query_feeds', authenticate, controller.feeds.queryFeedsFromBackstage);
  router.get('/v1/feed/search', authenticate, controller.feeds.search);
  router.get('/v1/privilege/ip_list', authenticate, controller.privilege.ipList);
  router.post('/v1/userlist', controller.user.userList);
  router.post('/v1/clublist', controller.user.clubList);
};
