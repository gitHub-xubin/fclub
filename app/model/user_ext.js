'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const UserExtModel = app.model.define('user_ext', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ip_id: INTEGER,
    uid: INTEGER,
    message_system_read_id: INTEGER,
    message_notice_read_id: INTEGER,
    create_time: DATE,
  });

  return UserExtModel;
};
