'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  return app.model.define('feeds', {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    ip_id: { type: INTEGER },
    club_id: { type: INTEGER, defaultValue: 0 },
    uid: { type: INTEGER, defaultValue: 0 },
    video: { type: STRING(1024) },
    images: { type: STRING(512) },
    source: { type: INTEGER, defaultValue: 1 },
    applied: { type: INTEGER, defaultValue: 0 },
    recommend_state: { type: INTEGER, defaultValue: 1 },
    is_top_club: { type: INTEGER, defaultValue: 0 },
    is_top_home: { type: INTEGER, defaultValue: 0 },
    content: { type: STRING },
    like_cnt: { type: INTEGER, defaultValue: 0 },
    comment_cnt: { type: INTEGER, defaultValue: 0 },
    create_time: { type: DATE, defaultValue: NOW() },
    origin_time: { type: DATE, defaultValue: NOW() },
    crawling_raw: { type: STRING, defaultValue: null },
    crawling_id: { type: STRING(255), defaultValue: null },
    yn: { type: INTEGER, defaultValue: 1 },
  }, {
    tableName: 'feeds',
  });
};
