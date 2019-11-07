'use strict';

const Service = require('egg').Service;

class UserService extends Service {
	
	async getLists(page,pageSize){
		page = page-1;
		const limit = page*pageSize;
	
		const list = await this.app.mysql.query('select * from `users` where ip_id = 1002 limit '+limit+','+pageSize);
		const count = await this.app.mysql.query('select count(*) as count from `users` where ip_id = ? ',[1002]);
		//console.log(count);
		var data = {};
		data.list = list;
		data.count = count[0].count;
		return data;
	  }
}

module.exports = UserService;
