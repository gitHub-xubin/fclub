/**
 * Created by wenglibo on 2018/8/25.
 */

'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  return app.model.define('feed_crawling_config', {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    platform_uid: { type: STRING(32) },
    uid: { type: INTEGER },
    source: { type: INTEGER, defaultValue: 1 },
    ip_id: { type: INTEGER },
    since_id: { type: STRING(255) },
    latest_update_time: { type: DATE, defaultValue: NOW() },
  }, {
    tableName: 'feed_crawling_config',
  });
};
