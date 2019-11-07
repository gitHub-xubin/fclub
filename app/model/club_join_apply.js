'use strict';

const { ApprovalState } = require('../const/const');

module.exports = app => {
  const { STRING, INTEGER, DATE, VIRTUAL } = app.Sequelize;

  const ClubJoinApplyModel = app.model.define('club_join_apply', {
    apply_id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uid: INTEGER,
    club_id: INTEGER,
    state: INTEGER,
    approval_time: DATE,
    approval_uid: INTEGER,
    create_time: DATE,

    user: {
      type: VIRTUAL,
    },

    club: {
      type: VIRTUAL,
    },
  });

  Object.assign(ClubJoinApplyModel, {
    getUserApplyList(ip_id, uid) {
      return ClubJoinApplyModel.findAll({
        where: { uid },
        raw: true,
      });
    },

    /**
     * 查询俱乐部加入申请列表
     * @param club_id
     * @return {*}
     */
    getClubApplies(club_id, offset = 0, limit = 20) {
      return ClubJoinApplyModel.findAll({
        where: { club_id, state: ApprovalState.Submit },
        order: [[ 'create_time', 'desc' ]],
        offset,
        limit,
      });
    },
  });

  return ClubJoinApplyModel;
};
