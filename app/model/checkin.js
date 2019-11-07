'use strict';

module.exports = app => {
  const { DATEONLY, INTEGER, DATE, VIRTUAL } = app.Sequelize;

  const CheckInModel = app.model.define('checkin', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    club_id: INTEGER,
    uid: INTEGER,
    checkin_date: DATEONLY,
    create_time: DATE,
  });

  Object.assign(CheckInModel, {

    /**
     * 查询打卡纪录
     * @param uid
     * @param limit
     * @param offset
     * @return {*}
     */
    queryCheckInHistory(uid, limit, offset = 0) {
      const { Club } = app.model;

      return CheckInModel.findAll({
        include: [
          {
            model: Club,
            attributes: [ 'name' ],
          }
        ],
        where: { uid },
        order: [ [ 'create_time', 'desc' ] ],
        offset,
        limit,
      });
    },


    /**
     * 查询指定日子俱乐部的签到人数
     * @param club_id
     * @param date
     * @return {*}
     */
    queryClubDateCheckInCount(club_id, date) {
      return CheckInModel.count({
        where: { club_id, checkin_date: date },
      })
    },

    associate() {
      const { Club } = app.model;
      CheckInModel.belongsTo(Club, { foreignKey: 'club_id' });
    },

  });

  return CheckInModel;
};

