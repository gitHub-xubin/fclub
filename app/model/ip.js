'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const IpModel = app.model.define('ip', {
    ip_id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    appid: STRING(64),
    name: STRING(64),
    pic: STRING(256),
    profile_pic: STRING(256),
    profile: {
      type: STRING,
      get() {
        const val = this.getDataValue('profile');
        if (val && typeof val === 'string') {
          return JSON.parse(val);
        }
        return val;
      },
    },
    desc: STRING(512),
    create_time: DATE,
  }, {
    tableName: 'ips',
  });

  return IpModel;
};
