'use strict';

const { ClubRole, InfoLevel } = require('../const/const');

module.exports = app => {
  const { INTEGER, DATE, Op } = app.Sequelize;

  const ClubMemberModel = app.model.define('club_member', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    club_id: INTEGER,
    uid: INTEGER,
    role: INTEGER,
    score: INTEGER,
    last_visit: DATE,
    create_time: DATE,

    // user: {
    //   type: VIRTUAL,
    // }
  });

  const attributes = {
    [InfoLevel.Base]: [ 'id', 'club_id', 'uid', 'role' ],
    [InfoLevel.Simple]: [ 'id', 'club_id', 'uid', 'role', 'create_time' ],
   // [InfoLevel.Full]: Object.keys(ClubMemberModel.attributes),
  };

  Object.assign(ClubMemberModel.prototype, {
    isAdmin() {
      return this.get('role') == ClubRole.Admin;
    },

    // 是否有管理权限
    hasAdminPermission() {
      const role = this.get('role');
      return role == ClubRole.Owner || role == ClubRole.Admin;
    },

    isOwner() {
      const role = this.get('role');
      return role == ClubRole.Owner;
    },
  });

  Object.assign(ClubMemberModel, {
    /**
     * 获取用户加入的俱乐部列表
     * @param uid
     * @param order
     * @return {Promise.<void>}
     */
    async getUserClubRoleList(uid, { ip_id, attributes, orderBy, offset = -1, limit = -1 } = {}) {
      const where = {
        uid,
      };

      const order = [];

      switch (orderBy) {
        case 'visit':
          order.push([ 'last_visit', 'desc' ]);
          break;

        default:
          order.push([ 'create_time', 'desc' ]);
          break;
      }

      const include = [];

      if (ip_id) {
        include.push({
          model: app.model.Club,
          where: { ip_id },
        })
      }

      const option = {
        include,
        attributes,
        where,
        order,
        raw: true,
      };


      if (offset > -1 && limit > -1) {
        Object.assign(option, { offset, limit });
      }

      const list = await ClubMemberModel.findAll(option);

      return list;
    },

    getAttributes(level) {
      return attributes[ level ] || attributes[ InfoLevel.Full ];
    },

    getClubAdminCount(club_id) {
      return ClubMemberModel.count({
        where: { club_id, role: ClubRole.Admin },
      });
    },

    /**
     * 根据名称查找会员
     * @param name
     * @param club_id
     */
    searchMember(name, { attributes, club_id, offset, limit } = {}) {

      const UserModel = app.model.User;

      const options = {
        attributes,
        include: [
          {
            model: UserModel,
            attributes: UserModel.getAttributes(InfoLevel.Base),
            where: {
              nickname: { [Op.like]: '%' + name + '%' },
            },
          },
        ],
        where: {
          club_id,
        },
        order: [ [ 'create_time', 'desc' ] ],
      };

      if (offset && limit) {
        options.offset = offset;
        options.limit = limit;
      }

      return ClubMemberModel.findAll(options);
    },

    /**
     * 查询俱乐部会员列表
     * @param club_id
     * @param includeUser
     * @param role
     * @param append_uids
     * @param offset
     * @param limit
     * @return {*}
     */
    queryMemberList(club_id, { includeUser = false, role, append_uids, offset, limit } = {}) {
      const where = { club_id };

      const include = [];
      if (includeUser) {
        const UserModel = app.model.User;
        include.push({
          model: UserModel,
          attributes: UserModel.getAttributes(InfoLevel.Base),
        });
      }

      const option = {
        include,
        attributes: [ 'uid', 'role', 'create_time' ],
        where,
        order: [ [ 'id', 'asc' ] ],
      };

      if (offset !== undefined) {
        option.offset = offset;
      }

      if (limit > 0) {
        option.limit = limit;
      }

      const or_cond = [];

      if (role !== undefined) {
        if (role & ClubRole.Admin && role & ClubRole.Owner) {
          or_cond.push({ role: { [Op.gt]: 0 } });
        } else if (role & ClubRole.Admin) {
          or_cond.push({ role: 1 });
        } else if (role & ClubRole.Owner) {
          or_cond.push({ role: 2 });
        }
      }

      if (append_uids && append_uids.length) {
        or_cond.push({ uid: append_uids });
      }

      if (or_cond.length) {
        where[ Op.or ] = or_cond;
      }

      return ClubMemberModel.findAll(option);
    },

    addScore(club_id, uid, add_score) {
      return ClubMemberModel.increment('score', {
        by: add_score,
        where: { club_id, uid },
      });
    },

    queryScoreRankList(club_id, limit = 20, offset = 0) {
      const { User } = app.model;

      return ClubMemberModel.findAll({
        include: [
          {
            model: User,
            attributes: User.getAttributes(InfoLevel.Base),
          }
        ],
        where: { club_id },
        order: [ [ 'score', 'desc' ] ],
        offset,
        limit,
      });
    },

    associate() {
      ClubMemberModel.belongsTo(app.model.User, { foreignKey: 'uid' });
      ClubMemberModel.belongsTo(app.model.Club, { foreignKey: 'club_id', targetKey: 'club_id' });
    },
  });


  return ClubMemberModel;
};
