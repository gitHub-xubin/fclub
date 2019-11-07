'use strict';


module.exports = app => {

  const { INTEGER } = app.Sequelize;

  const ClubMemberBackup = app.model.define('club_member_backup', {
    club_id: {
      type: INTEGER,
      primaryKey: true,
    },
    uid: {
      type: INTEGER,
      primaryKey: true,
    },
    score: INTEGER,
  });

  Object.assign(ClubMemberBackup, {
    // 初始化
    initMember(club_id, uid) {
      return ClubMemberBackup.findOrCreate({
        where: { club_id, uid },
        defaults: {
          score: 0,
        }
      })
    },
  });

  return ClubMemberBackup;
};
