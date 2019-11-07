'use strict';

const util = require('util');

module.exports = () => {

  const loggerFormat = [
    'ip:%s',
    'method:%s',
    'url:%s',
    'token:%s',
    'uid:%s',
    'querystring:%s',
    'body:%j',
    'response:%j'
  ].join(' | ');

  return async function logRequest(ctx, next) {
    const start_time = Date.now();

    await next();

    const execute_time = Date.now() - start_time;

    const {
      app,
      request,
      request: {
        body: request_body,
        url,
        querystring,
        method,
      },
      ip,
      body,
      uid,
      disableRequestLog = false,
    } = ctx;

    if (disableRequestLog) {
      return;
    }

    const logger = app.getLogger('requestLogger');
    // const logger = app.logger;

    // const info = util.format(loggerFormat,
    //   ip,
    //   method,
    //   url,
    //   request.get('authorization'),
    //   uid,
    //   querystring,
    //   request_body,
    //   body,
    //   execute_time
    // );



    logger.info([
      ip,
      method,
      url,
      request.get('authorization'),
      uid,
      querystring,
      request_body ? JSON.stringify(request_body) : '',
      JSON.stringify(body),
      execute_time + 'ms'
    ].join('	'));
  }
};
