'use strict';

//const OAuthError = require('oauth2-server/lib/errors/oauth-error');
//const { ErrorCode, CustomError } = require('../lib/custom_error');

module.exports = () => {
  return async function errorHandler(ctx, next) {
    await next().catch(err => {
      // if (err instanceof OAuthError) {
      //   const { code, message } = err;
      //
      //   err = new CustomError(message);
      //
      //   switch (code) {
      //     case 401:
      //       err
      //         .setCode(ErrorCode.AccessTokenExpired);
      //       break;
      //   }
      // }
      ctx.fail(err);
      const { level: logMethod = 'warn' } = err;
      ctx.app.logger[ logMethod ](err);
    });
  };
};
