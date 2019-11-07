/**
 * Created by wenglibo on 2018/8/20.
 */

"use strict";

const Service = require('egg').Controller;
const { ArgumentError, CustomError } = require('../lib/custom_error');
const md5 = require("md5");
const _ = require("underscore");


/**
 * random generate charset
 * @param length
 * @return {string}
 */
function random_charset(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

class AccountService extends Service {

  get adminAccount() {
    return this.app.model.AdminAccount;
  }


  /**
   * 登录
   * @param user_name
   * @param password
   * @return
   */
  async login(user_name, password) {
    if (!user_name || !password) {
      throw new ArgumentError({ user_name, password });
    }

    const admin_account = await this.adminAccount.findOne({ where: { user_name } });
    if (_.isNull(admin_account)) {
      throw new CustomError("用户名或密码错误");
    }

    const salt = admin_account.salt;
    const crypto_password = md5(password + salt);
    //console.log("login , crypto_password, ", crypto_password, password + salt);
    if (crypto_password !== admin_account.password) {
      throw new CustomError("用户名或密码错误");
    }
    return admin_account.id;
  }

  /**
   * 注册
   * @param user_name
   * @param password
   * @param uid
   * @return
   */
  async register(user_name, password, uid) {
    if ((typeof(user_name) !== 'string' || typeof(password) !== 'string') ||
      (user_name.length <= 0 || password.length <= 0)) {
      throw new ArgumentError({ user_name, password });
    }
    const admin_account = await this.adminAccount.findOne({ where: { user_name } });
    if (_.isObject(admin_account)) {
      //throw new CustomError("用户已存在");
      return admin_account.id;
    }
    const salt = random_charset(5);
    const crypto_password = md5(password + salt);
    const generated_account = await this.adminAccount.create({ user_name, password: crypto_password, salt, uid });
    return generated_account.id;
  }
}

module.exports = AccountService;