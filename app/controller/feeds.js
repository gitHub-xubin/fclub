'use strict';

const Controller = require('egg').Controller;
const { PermissionDenied } = require('../lib/custom_error');
const _ = require('underscore');

class FeedController extends Controller {
  /**
   * 查询后台动态
   * @return {Promise.<void>}
   */
  async queryFeedsFromBackstage() {
    const { ctx } = this;
    const { ip_id, type, page, count } = ctx.request.query;
    const { uid } = ctx;

    await this._checkingPrivilegeWithIPID(ip_id, uid);

    const ret = await ctx.service.adminFeedsService.queryFeedsFromBackstage(ip_id, type, { page, count });
    this.ctx.success({
      ret: ret.feeds,
      counts: ret.counts
    });
  }

  /**
   * 置顶动态
   * @return {Promise.<void>}
   */
  async topOne() {
    const { ctx } = this;
    const { feed_id, opt } = ctx.request.body;
    const { uid } = ctx;

    await this._checkingPrivilegeWithFeedID(feed_id, uid);

    const ret = await ctx.service.adminFeedsService.topOne(feed_id, parseInt(opt));
    this.ctx.success({ ret });
  }


  /** 推送到明星首页
   *
   * @return {Promise.<void>}
   */
  async pushToIPHostPage() {
    const { ctx } = this;
    const { feed_id, opt } = ctx.request.body;
    const { uid } = ctx;

    await this._checkingPrivilegeWithFeedID(feed_id, uid);

    const optInt = parseInt(opt);
    const ret = await ctx.service.adminFeedsService.pushToIPHostPage(feed_id, optInt);
    if (optInt === 1) {
      const recrawl_ret = await ctx.service.adminFeedsService.resourceRecrawl(feed_id);
      this.app.logger.info("FeedController.pushToIPHostPage | recrawl_ret : ", recrawl_ret);
    }
    this.ctx.success({ ret });
  }

  /**
   * 删除动态
   * @return {Promise.<void>}
   */
  async destroyOne() {
    const { ctx } = this;
    const { feed_id } = ctx.request.body;
    const { uid } = ctx;

    await this._checkingPrivilegeWithFeedID(feed_id, uid);

    const ret = await ctx.service.adminFeedsService.destroyOne(feed_id);
    this.ctx.success({ ret });
  }

  /**
   * 搜索
   * @return {Promise<void>}
   */
  async search() {
    const { ctx } = this;
    const { user_keyword, feed_keyword, page, count } = ctx.request.query;
    const { uid } = ctx;

    const admin_privileges = await ctx.model.AdminPrivilege.findAll({ where: { account_id: uid }, raw: true });
    if (!admin_privileges || _.isEmpty(admin_privileges)) {
      throw new PermissionDenied();
    }
    const manage_ips = _.pluck(admin_privileges, "ip_id");

    const ret = await ctx.service.adminFeedsService.search(
      user_keyword, feed_keyword, manage_ips, { page, count });
    this.ctx.success({ ret: ret.feeds, counts: ret.counts });
  }

  /**
   * 资源重新抓取
   * @return {Promise<void>}
   */
  async resourceRecrawl() {
    const { ctx } = this;
    const { feed_id } = ctx.request.body;
    const { uid } = ctx;

    const admin_privileges = await ctx.model.AdminPrivilege.findAll({ where: { account_id: uid }, raw: true });
    if (!admin_privileges || _.isEmpty(admin_privileges)) {
      throw new PermissionDenied();
    }

    const ret = await ctx.service.adminFeedsService.resourceRecrawl(feed_id);
    if (ret.resultCode === 200) {
      // 抓取成功，返回抓取后的值
      const after_feed = await ctx.model.Feeds.findOne({ where: { id: feed_id } });
      this.ctx.success({ feed: after_feed });
    } else {
      this.ctx.fail(ret);
    }
  }

  /**
   * 检查权限
   * @param feed_id
   * @param uid
   * @return {Promise<void>}
   * @private
   */
  async _checkingPrivilegeWithFeedID(feed_id, uid) {
    const { ctx } = this;
    const feed = await ctx.model.Feeds.findOne({ where: { id: feed_id } });
    return await this._checkingPrivilegeWithIPID(feed.ip_id, uid);
  }

  async _checkingPrivilegeWithIPID(ip_id, uid) {
    const { ctx } = this;
    // this.app.logger.info('_checkingPrivilegeWithIPID', ip_id, uid);
    const privilege_model = await ctx.model.AdminPrivilege.findOne({ where: { ip_id, account_id: uid } });
    // this.app.logger.info('_checkingPrivilegeWithIPID privilege_model', !!privilege_model);
    if (!privilege_model) {
      throw new PermissionDenied();
    }
  }
}

module.exports = FeedController;
