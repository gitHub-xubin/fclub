'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, VIRTUAL } = app.Sequelize;

  const ClubModel = app.model.define('club', {
    club_id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ip_id: INTEGER,
    name: {
      type: STRING(64),
      validate: {
        len: [ 3, 20 ],
      },
    },
    pic: STRING(256),
    desc: STRING(512),
    member_cnt: INTEGER,
    owner_uid: INTEGER,
    is_public: {
      type: INTEGER,
      validate: {
        isIn: [ [ 0, 1 ] ],
      },
    },
    need_apply: {
      type: INTEGER,
      validate: {
        isIn: [ [ 0, 1 ] ],
      },
    },
    create_time: DATE,

    // 是否已经签到
    has_checked: VIRTUAL,

    owner: VIRTUAL,

    checkin_cnt: VIRTUAL,  // 当天签到人数

    admin: {
      type: VIRTUAL,
      defaultValue: [],
    },

    // 当前用户在俱乐部中的资料
    member: VIRTUAL,

    apply: VIRTUAL,

    role: {
      type: VIRTUAL,
      set(val) {
        this.setDataValue('role', val);
      },
      get() {
        const val = this.getDataValue('role');
        if (val !== undefined) {
          return val;
        }

        if (this.member) {
          return this.member.role;
        }

        return -1;
      },
    },
  });


  Object.assign(ClubModel, {
    /**
     * 根据昵称查询俱乐部
     * @param name
     * @param ip_id
     */
    findByName(name, { ip_id }) {
      return ClubModel.findOne({
        where: { ip_id, name },
      });
    },

    incrementMemberCount(club_id, num, options) {
      if (isNaN(num)) {
        throw new Error('val must be number');
      }

      const values = {
        member_cnt: app.model.literal([ '`member_cnt`', num ].join('+')),
      };

      options = Object.assign({}, options, { where: { club_id }, limit: 1 });

      return ClubModel.update(values, options);
    },
  });

  return ClubModel;
};
