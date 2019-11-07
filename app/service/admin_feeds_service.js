/**
 * Created by wenglibo on 2018/8/20.
 */

"use strict";

const Service = require('egg').Service;
const Const = require('../const/const');
const { ArgumentError, EntityNotFound, CustomError } = require('../lib/custom_error');
const Pagination = require("../lib/page_param");
const _ = require('underscore');

class AdminFeedsService extends Service {


  get feedModel() {
    return this.app.model.Feeds;
  }

  get userModel() {
    return this.app.model.User;
  }

  get ipModel() {
    return this.app.model.Ip;
  }

  get clubModel() {
    return this.app.model.Club;
  }

  selectedFeedAttrs(striped) {
    const attrs = ['id', 'ip_id', 'uid', 'club_id', 'source', 'applied',
      'recommend_state', 'prior', 'is_top_club', 'is_top_home',
      'video', 'images', 'content', 'like_cnt', 'comment_cnt', 'create_time', 'origin_time',
      'crawling_raw', 'crawling_id', 'yn'];
    return _.filter(attrs, attr => {
      return !_.contains(striped, attr);
    })
  }

  /**
   * 推送/取消推送到明星首页（用于已审核过的动态或抓取的动态）
   * @param feed_id
   * @param opt: 1 推送，0 取消推送
   * @return {Promise.<void>}
   */
  async pushToIPHostPage(feed_id, opt) {
    if (isNaN(feed_id) || isNaN(opt)) {
      throw new ArgumentError({ feed_id, opt });
    }
    const recommend_state = (isNaN(opt) || opt === 0) ?
      Const.FeedsRecommendState.NORMAL :
      Const.FeedsRecommendState.RECOMMENDED;

    const feed = await this.feedModel.findOne({ where: { id: feed_id } });
    if (_.isNull(feed)) {
      throw new EntityNotFound();
    }

    const ret = await feed.update({ recommend_state });
    return ret.recommend_state === recommend_state;
  }

  /**
   * 置顶一条动态
   * @param feed_id
   * @param opt: 1 置顶，0 取消置顶
   * @return {Promise.<void>}
   */
  async topOne(feed_id, opt) {
    if (isNaN(feed_id) || isNaN(opt)) {
      throw new ArgumentError({ feed_id, opt });
    }
    const prior = (!isNaN(opt) && opt !== 0) ? 1 : 0;
    const ret = await this.feedModel.update(
      { is_top_home: prior },
      { where: { id: feed_id } }
    );
    return ret[ 0 ] > 0;
  }

  /**
   * 从审核池中忽略
   * @param feed_id
   * @return {Promise.<void>}
   */
  async ignoreFromReviewPool(feed_id) {
    if (isNaN(feed_id)) {
      throw new ArgumentError([ feed_id ]);
    }
    const ret = await this.feedModel.update({ applied: 0 }, { where: { id: feed_id } });
    return ret[ 0 ] > 0;
  }

  /**
   * 删除一条动态
   * @param feed_id
   * @return {Promise.<void>}
   */
  async destroyOne(feed_id) {
    if (isNaN(feed_id)) {
      throw new ArgumentError([ feed_id ]);
    }
    const ret = await this.feedModel.update({ yn: 0 }, { where: { id: feed_id } });
    return ret[ 0 ] > 0;
  }

  /**
   * 从后台查询动态列表
   * @param ip_id
   * @param type 查询类型,参考 FeedsBackstageType
   * @param page
   * @param count
   * @return {}
   */
  async queryFeedsFromBackstage(ip_id, type, { page = 1, count = 20 }) {
    if (isNaN(ip_id) || isNaN(type)) {
      throw new ArgumentError({ ip_id, type });
    }
    this.app.logger.info('AdminFeedsService.queryFeedsFromBackstage | ', ip_id, type);

    const pagination = new Pagination(page, count);
    let where = {};
    const type_integer = parseInt(type);
    switch (type_integer) {
      case Const.FeedsBackstageType.WEIBO: {
        where = {
          ip_id,
          recommend_state: Const.FeedsRecommendState.NORMAL,
          source: Const.FeedsSource.WEIBO,
        };
      }
        break;

      case Const.FeedsBackstageType.CLUBS: {
        where = {
          ip_id,
          recommend_state: Const.FeedsRecommendState.NORMAL,
          applied: 1,
          source: Const.FeedsSource.CLUB,
        };
      }
        break;

      case Const.FeedsBackstageType.PUSH_TO_HOST: {
        where = {
          ip_id,
          recommend_state: Const.FeedsRecommendState.RECOMMENDED
        };
      }
        break;

      case Const.FeedsBackstageType.TOP: {
        where = {
          ip_id,
          is_top_home: 1,
        };
      }
        break;

      default:
        this.app.logger.warn('AdminFeedsService.queryFeedsFromBackstage | unknown type.');
        return { counts: 0, feeds: [] };
    }

    // Model using flag
    where = _.extend(where, { yn: Const.ModelUsingFlag.YES });


    let {count: counts, rows: feeds} = await this.feedModel.findAndCountAll({
      where,
      attributes: this.selectedFeedAttrs(['crawling_raw']),
      order: [ [ "origin_time", "DESC" ] ],
      offset: pagination.offset,
      limit: pagination.limit,
      raw: true,
    });
    feeds = await this._expandEntryListWithUser(feeds);
    feeds = await this._expandFeedListClubInformation(feeds);
    feeds = await this._expandEntryFeedListWithIP(feeds, ip_id);
    return { counts, feeds };
  }

  /**
   * 重新抓取feed_id对应资源
   * @param feed_id
   * @return {Promise<void>}
   */
  async resourceRecrawl(feed_id) {
    // 先查找出来
    const feed = await this.ctx.model.Feeds.findOne({ where: { id: feed_id } });
    // 通知rpc主服务重新抓取
    return await this.ctx.proxy.feedService.retryCrawling({mid: feed.crawling_id});
  }


  /**
   * 搜索feeds
   * @param user_keyword
   * @param status_keyword
   * @param ips
   * @param page
   * @param count
   * @return {Promise<{count: number, feeds: *}>}
   */
  async search(user_keyword, status_keyword, ips, { page = 1, count = 20 }) {
    let feeds = [];
    let counts = 0;
    const pagination = new Pagination(page, count);

    if (user_keyword) {
      // const user_keyword_query =
      //   "SELECT * FROM `feeds` f JOIN `users` u ON f.uid = u.uid WHERE u.`nickname` like '%" + user_keyword + "%' " +
      //   "LIMIT " + pagination.offset + ', ' + pagination.limit;
      const users = await this.userModel.findAll({
        attributes: [ 'uid' ],
        where: {
          nickname: {
            [ this.app.model.Op.like ]: '%' + user_keyword + '%'
          },
        },
        raw: true,
      });
      const uids = _.pluck(users, 'uid');
      const ret = await this.feedModel.findAndCountAll({
        attributes: this.selectedFeedAttrs(['crawling_raw']),
        where: {
          uid: uids,
          ip_id: ips,
        },
        offset: pagination.offset,
        limit: pagination.limit,
        raw: true,
      });
      counts = ret.count;
      feeds = ret.rows;
    } else if (status_keyword) {
      const ret = await this.feedModel.findAndCountAll({
        attributes: this.selectedFeedAttrs(['crawling_raw']),
        where: {
          content: {
            [ this.app.model.Op.like ]: '%' + status_keyword + '%'
          },
          ip_id: ips,
        },
        offset: pagination.offset,
        limit: pagination.limit,
        raw: true,
      });
      counts = ret.count;
      feeds = ret.rows;
    }
    feeds = await this._expandFeedListClubInformation(feeds);
    feeds = await this._expandEntryListWithUser(feeds);
    return { counts, feeds };
  }

  /***
   * 扩展用户信息
   * @param list
   * @return {Promise<*>}
   * @private
   */
  async _expandEntryListWithUser(list) {
    const uids = _.uniq(_.pluck(list, 'uid'));
    if (uids.length <= 0) {
      return list;
    }
    const users = await this.userModel.findAll({
      where: { uid: uids },
      attributes: [ 'uid', 'nickname' ],
      raw: true
    });
    return _.map(list, obj => {
      const user = _.find(users, u => {
        return (u.uid === obj.uid);
      });
      return _.extend(obj, { user });
    });
  }

  /**
   * 扩展ip信息
   * @param feed_list
   * @param ip_id
   * @return {Promise<*>}
   * @private
   */
  async _expandEntryFeedListWithIP(feed_list, ip_id) {
    if (feed_list.length <= 0) {
      return feed_list;
    }

    const ip_info = await this.ipModel.findOne({ where: { ip_id } });
    if (!ip_info) {
      return feed_list;
    }

    const ext_info = _.pick(ip_info, [ 'name', 'pic' ]);
    return _.map(feed_list, f => {
      if (f.uid !== 0) {
        return f;
      }
      return _.extend(f, { ip_info: ext_info });
    });
  }

  /**
   * 扩充当前feed列表club信息
   * @param feed_list
   * @return {Promise.<void>}
   * @private
   */
  async _expandFeedListClubInformation(feed_list) {
    const club_list = await this.clubModel.findAll({
      where: { club_id: _.pluck(feed_list, 'club_id') },
      raw: true,
    });

    if (club_list.length <= 0) {
      return feed_list;
    }

    const filtered_list = _.filter(club_list, club => {
      return club !== null;
    });

    return _.map(feed_list, feed => {
      const found_club = _.find(filtered_list, club => {
        return club.club_id === feed.club_id;
      });
      return _.extend(feed, { club: found_club || {} });
    });
  }
}

module.exports = AdminFeedsService;
