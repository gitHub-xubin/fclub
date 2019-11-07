'use strict';

// had enabled by egg
// exports.static = true;

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.sofaRpc = {
  enable: true,
  package: 'egg-sofa-rpc',
};
exports.mysql = {
  enable: true,
　package: 'egg-mysql',
};
