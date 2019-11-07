'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const WechatConfig = app.model.define('wechat_config', {
    appid: {
      type: STRING,
      primaryKey: true,
    },

    secret: STRING,
    create_time: DATE,
  });

  return WechatConfig;
};
