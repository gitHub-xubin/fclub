'use strict';

module.exports = {
  UserState: {
    Normal: 1,
    Forbidden: 2,
  },

  // 信息级别，如查询用户信息，Base:只有昵称、UID，Simple：包含头像、生日 Full:所有
  InfoLevel: {
    Base: 1,
    Simple: 2,
    Full: 3,
  },

  // 俱乐部中的角色（权限）
  ClubRole: {
    Normal: 0,
    Admin: 1,
    Owner: 2,
  },


  // 俱乐部加入申请状态
  ApprovalState: {
    Submit: 0,
    Approved: 1,
    Rejected: 2,
  },

  // 动态来源
  FeedsSource: {
    CLUB: 1,
    WEIBO: 2,
  },

  // 动态推荐状态
  FeedsRecommendState : {
    NORMAL : 1,
    RECOMMENDED: 2,
  },

  // 动态的后台标签类型
  FeedsBackstageType: {
    WEIBO: 1,
    CLUBS: 2,
    PUSH_TO_HOST: 3,
    TOP: 4,
  },

  // model 实体可用标记
  ModelUsingFlag: {
    NO: 0,
    YES: 1,
  },
};
