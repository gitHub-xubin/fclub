'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const OauthCodeModel = app.model.define('OauthCode', {
    code: {
      type: STRING,
      primaryKey: true,
    },
    expires_at: DATE,
    redirect_uri: STRING,
    scope: STRING,
    client_id: STRING,
    uid: INTEGER,
    create_time: DATE,
  }, {
    tableName: 'oauth_codes',
  });

  return OauthCodeModel;
};
