'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const { InfoLevel } = require('../const/const');
  const _ = require('underscore');

  const UserModel = app.model.define('user', {
    uid: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ip_id: INTEGER,
    gender: {
      type: INTEGER,
      validate: {
        isIn: [ [ 0, 1, 2 ] ],
      },
    },
    desc: {
      type: STRING,
      validate: {
        len: [ 0, 100 ],
      },
    },
    nickname: {
      type: STRING(30),
      validate: {
        len: [ 2, 20 ],
      },
    },
    mobile: STRING(14),
    pic: STRING(512),
    profile_pic: STRING,
    city: STRING,
    birthday: DATE,
    province: STRING,
    country: STRING,
    score: INTEGER,
    state: INTEGER,
    create_time: DATE,
  });

  const
    userBaseAttribute = [ 'uid', 'gender', 'nickname', 'pic' ],
    userSimpleAttribute = _.union(userBaseAttribute, [ 'score', 'desc', 'profile_pic' ]);

  const userLevelAttribute = {
    [InfoLevel.Base]: userBaseAttribute,
    [InfoLevel.Simple]: userSimpleAttribute,
    [InfoLevel.Full]: UserModel.attributes,
  };

  Object.assign(UserModel, {
    findByName(nickname) {
      return UserModel.findOne({
        where: { nickname },
      });
    },

    addScore(uid, add_score) {
      return UserModel.increment('score', {
        by: add_score,
        where: { uid },
      });
    },

    queryScoreRankList(limit = 10, offset = 0) {
      return UserModel.findAll({
        attributes: [ 'uid', 'gender', 'nickname', 'pic', 'score' ],
        order: [ [ 'score', 'desc' ] ],
        offset,
        limit,
      });
    },

    getAttributes(level) {
      return userLevelAttribute[ level ];
    },
  });

  return UserModel;
};
