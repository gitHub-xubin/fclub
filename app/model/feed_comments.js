/**
 * Created by wenglibo on 2018/8/11.
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, VIRTUAL } = app.Sequelize;

  return app.model.define('feed_comments', {
    id: { type: INTEGER, autoIncrement: true, primaryKey: true },
    feed_id: { type: INTEGER },
    uid: { type: INTEGER },
    reply_id: { type: INTEGER },
    content: { type: STRING },
    create_time: { type: DATE, defaultValue: new Date() },
    yn: { type: INTEGER, defaultValue: 1 },

    user: VIRTUAL, // 回复的用户
    reply_comment: VIRTUAL, // 被回复的评论
  }, {
    tableName: 'feed_comments',
  });
};
