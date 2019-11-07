'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const WechatBind = app.model.define('WechatBind', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uid: INTEGER,
    appid: STRING,
    openid: STRING,
    unionid: STRING,
    create_time: DATE,
  }, {
    tableName: 'wechat_binds',
  });

  return WechatBind;
};
