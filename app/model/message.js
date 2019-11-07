'use strict';

const { MessageCategory, MessageType } = require('../const/const');

module.exports = app => {
  const { parse: ParseJson } = global.JSON;
  const { STRING, JSON, INTEGER, VIRTUAL, DATE, Op } = app.Sequelize;

  const MessageModel = app.model.define('message', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ip_id: INTEGER,
    to_uid: INTEGER,
    from_uid: INTEGER,
    from_club_id: INTEGER,
    type: INTEGER,
    content: {
      type: JSON,
      get() {
        const content = this.getDataValue('content');
        if (content) {
          try {
            return ParseJson(content);
          } catch (e) {
            app.logger.warn(e);
          }
        }
        return null;
      }
    },
    create_time: DATE,

    to_user: VIRTUAL,
    from_user: VIRTUAL,
    from_club: VIRTUAL,
  });

  Object.assign(MessageModel, {

    queryUserMessage(ip_id, to_uid, category_type, limit = 10, offset = 0) {
      const where = { to_uid };

      if (ip_id) {
        where.ip_id = ip_id;
      }

      switch (category_type) {
        case MessageCategory.Notice:
          where.type = {
            [Op.gt]: 99,
          };
          break;

        case MessageCategory.System:
          where.type = {
            [Op.lt]: 100,
          };
          break;

        default:
          break;
      }

      const options = {
        where,
        order: [ [ 'id', 'desc' ] ],
        offset,
        limit,
      };
      return MessageModel.findAll(options);
    },

    /**
     * 检查是否有新消息
     * @param type
     * @param ip_id
     * @param uid
     * @param read_id
     */
    async hasUnreadMessage(type, ip_id, to_uid, read_id) {
      const where = {
        ip_id,
        to_uid,
        id: {
          [Op.gt]: read_id,
        },
      };

      switch (type) {
        case MessageCategory.Notice:
          where.type = {
            [Op.gt]: 99,
          };
          break;

        case MessageCategory.System:
          where.type = {
            [Op.lt]: 100,
          };
          break;

        default:
          break;
      }

      const msg = await MessageModel.findOne({
        attributes: [ 'id' ],
        where,
      });

      return !!msg;
    },

  });

  return MessageModel;
};
