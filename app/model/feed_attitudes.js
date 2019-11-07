/**
 * Created by wenglibo on 2018/8/12.
 */

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  return app.model.define('feed_attitudes', {
    uid: { type: INTEGER, primaryKey: true },
    feed_id: { type: INTEGER, primaryKey: true },
    opt: { type: INTEGER },
    create_time: { type: DATE },
    yn: { type: INTEGER, defaultValue: 1 },
  }, {
    tableName: 'feed_attitudes',
  });
};
