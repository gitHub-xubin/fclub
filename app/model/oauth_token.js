'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const OAuthTokenModel = app.model.define('OAuthToken', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    access_token: STRING,
    expire_at: DATE,
    refresh_token: STRING,
    refresh_expire_at: DATE,
    scope: STRING,
    client_id: STRING,
    uid: INTEGER,
    create_time: DATE,
  }, {
    tableName: 'oauth_tokens',
  });

  return OAuthTokenModel;
};
