/**
 * Created by wenglibo on 2018/8/20.
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, VIRTUAL } = app.Sequelize;

  return app.model.define('admin_account', {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    uid: INTEGER,
    user_name: STRING(255),
    password: STRING(255),
    salt: STRING(255),
    create_time: {type: DATE, defaultVaue: new Date()},
  }, {
    tableName: 'admin_account',
  });
};
