'use strict';

const ErrorCode = {
  // 用户未注册
  NotRegister: 400,

  AccessTokenExpired: 401,

  UserForbidden: 403,

  // 权限受限
  AuthorizationDenied: 405,

  // 参数错误
  RequestParamError: 433,

  // 服务器内部错误
  ServiceError: 500,

  // 方法调用时参数错误
  ArgumentError: 600,

  EntityNotFound: 610,

  // 重复申请加入俱乐部
  ApplyClubJoinDuplicate: 11000,

  ApplyApprovedAlready: 11001, // 加入申请已被处理过

  ClubNameExists: 11100, // 俱乐部名称已存在

  // 访问隐私俱乐部
  PermissionDenied: 11001,

  // 用户未登录
  NotLogin: 11002,
};

module.exports = ErrorCode;
