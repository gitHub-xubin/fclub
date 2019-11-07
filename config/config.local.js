'use strict';

module.exports = appInfo => {
  return {
    cors: {
      credentials: true,
    },

    // cors: false,

    security: {
      domainWhiteList: [ 'http://localhost:8080' ],
    }
  }
};