'use strict';

module.exports = appInfo => {
  return {
    sequelize: {
      host: 'rm-uf62j8elpaq8m8f19.mysql.rds.aliyuncs.com',
      password: 'F6D8cpQNqcwM62GP',
    },

    redis: {
      client: {
        host: 'r-uf67e9bf225094c4.redis.rds.aliyuncs.com',
        password: 'pYWAVknFbkXJrhP9',
        db: '0',
      },
    },

    cors: {
      credentials: false,
    }
  }
};
