'use strict';

function defineError(code, msg) {
  return {
    message: msg,
    code,
    level: '',
  };
}

const ErrorCode = require('./error_code');

const Errors = {
  ArgumentError: defineError(5000, '参数错误'),

  UserForbidden: defineError(ErrorCode.UserForbidden, '帐号已被锁定，请联系管理员'),

  // 注册失败，openid已经绑定到其他帐号
  RegisterFailedOpenIdExists: defineError(10000, 'openid has bind another account'),

  // //---------------------------------------------------------------------------//
  // CommonErrorNotExistingInFeeds: defineError(10001, '动态不存在'),
  // CommonErrorNotExistingInUser: defineError(10002, '用户不存在'),
  // CommonErrorNotExistingInComment: defineError(10003, '评论不存在'),
  // CommonErrorNotExistingInIP: defineError(10004, 'IP不存在'),
  // CommonErrorNotExistingInClub: defineError(11005, '应援团不存在'),
  //
  // // ------------------------------------------------------------------------ //
  // // Feeds error
  // FeedsErrorPublishFailed: defineError(11001, "发布动态失败，系统错误"),
  // FeedsErrorLikeHasBeenPerformed: defineError(11002, "点赞失败，您已经赞过了。"),
  // FeedsErrorCancelLikeHasPerformed: defineError(11003, "取消点赞失败，您已经取消过了。"),
  // FeedsErrorDeleteCommentRepeated: defineError(11004, "删除评论失败，您已经删除过了。"),
  // FeedsErrorSetTopFailed: defineError(11005, "置顶动态失败，请先下掉当前的置顶。"),
};

module.exports = Errors;
