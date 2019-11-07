// Don't modified this file, it's auto created by egg-rpc-tool

'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = app => {
  const consumer = app.sofaRpcClient.createConsumer({
    interfaceName: 'com.fclubs.sofa.rpc.FeedService',
    targetAppName: 'sofarpc',
    version: '1.0',
    group: 'SOFA',
    proxyName: 'FeedService',
  });

  if (!consumer) {
    // `app.config['sofarpc.rpc.service.enable'] = false` will disable this consumer
    return;
  }

  app.beforeStart(async() => {
    await consumer.ready();
  });

  class FeedService extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }

    async retryCrawling(req) {
      return await consumer.invoke('retryCrawling', [ req ], { 
        ctx: this.ctx,
        codecType: 'protobuf',
      });
    }
  }

  return FeedService;
};
/* eslint-enable */



