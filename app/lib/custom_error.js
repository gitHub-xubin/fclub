'use strict';

const util = require('util');
const ErrorCode = require('../const/error_code');

class CustomError extends Error {
  /**
   * 自定义错误类
   * @param message [{string}] 错误信息
   * @param code [{number}]
   * @param level [{string}] 错误级别 info, warn, error
   */
  constructor(message = '', code = 0, level = '') {
    super(message);

    this.name = this.constructor.name;
    this.status = code || 500;
    this.level = level || 'warn';

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }

  setMessage(...args) {
    this.message = util.format.apply(util, args);

    return this;
  }

  setCode(code) {
    this.status = code;
    return this;
  }

  setLevel(level) {
    this.level = level;
    return this;
  }
}

class ArgumentError extends CustomError {
  constructor(params) {
    let msg;
    switch (true) {
      case params instanceof Array:
        msg = '参数缺失: `' + params.join('`,`') + '`';
        break;

      case typeof params === 'object':
        msg = '参数错误: ' + Object.keys(params).map(k => k + ':' + params[ k ]).join(',');
        break;

      default:
        msg = '参数错误';
        break;
    }
    super(msg, ErrorCode.ArgumentError, 'warn');
  }
}

class RequestParamError extends ArgumentError {
  constructor(params) {
    super(params);
    this.setCode(ErrorCode.RequestParamError);
  }
}

class EntityNotFound extends CustomError {
  constructor(params, msg = 'entity not found') {
    msg += ':' + Object.keys(params).map(k => k + '=' + params[ k ]).join(',');

    super(msg, ErrorCode.EntityNotFound, 'warn');
  }
}

class PermissionDenied extends CustomError {
  constructor(msg) {
    msg = msg || '没有权限';

    super(msg, ErrorCode.PermissionDenied, 'warn');
  }
}


module.exports = {
  CustomError,

  Error: CustomError,

  ArgumentError,

  RequestParamError,

  EntityNotFound,

  PermissionDenied,

  ErrorCode,

  Create(err_info) {
    const { message, code, level } = err_info;

    return new CustomError(message, code, level);
  },
};
