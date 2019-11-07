'use strict';

module.exports = appInfo => {
  const config = exports = {};
  const path = require('path');

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1534693476640_9767';

  // add your config here
  config.middleware = [ 'requestLogger', 'errorHandler' ];

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: '6379',
      // family: 'user',
      password: null,
      db: '0',
    },
    app: true,
    agent: false,
  };

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'fclub',
    // host: '47.52.233.138',
    host: '47.104.18.63',
    port: '3306',
    // username: 'fclub',
    username: 'fclub',
    // password: '123456',
    // password: 'c5UVaokRJutrl4B4',
    password: 'fc001',

    timezone: '+08:00',

    define: {
      timestamps: false,
    },

    pool: {
      max: 20,
      min: 3,
      idle: 60000,
      acquire: 10000,
    },
  };

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: '6379',
      // family: 'user',
      password: null,
      db: '0',
    },
    app: true,
    agent: false,
  };

  config.mysql = {
	// 单数据库信息配置
		client: {
			// host
			host: '47.104.18.63',
			// 端口号
			port: '3306',
			// 用户名
			user: 'fclub',
			// 密码
			password: 'fc001',
			// 数据库名
			database: 'fclub',
		},
		// 是否加载到 app 上，默认开启
		app: true,
		// 是否加载到 agent 上，默认关闭
		agent: false,
	};

  config.logger = {
    level: 'DEBUG',
    // consoleLevel: 'DEBUG',
  };

  config.customLogger = {
    requestLogger: {
      file: path.join(appInfo.root, 'logs', appInfo.name, 'request.log'),
    },
  };

  // config.security = false;
  config.security = {
    csrf: false,
    csp: false,
    hsts: false,
    noopen: false,
    nosniff: false,
    xframe: false,
    xssProtection: false,
  };

  config.sofaRpc = {
    registry: {
      address: '127.0.0.1:2181', // configure your real zk address
    },

    client: {
      responseTimeout: 10000,
    },

    // server: {
    //   namespace: 'com.fclubs.sofa.rpc',
    // },
  };

  return config;
};