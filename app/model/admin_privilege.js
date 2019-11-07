/**
 * Created by wenglibo on 2018/8/20.
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, VIRTUAL } = app.Sequelize;

  return app.model.define('admin_privilege', {
    account_id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    ip_id: INTEGER,
    create_time: {type: DATE, defaultVaue: new Date()},
  }, {
    tableName: 'admin_privilege',
  });
};
