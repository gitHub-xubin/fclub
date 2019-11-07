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

	  async getclubList(page,pageSize){
		page = page-1;
		const limit = page*pageSize;
	
		const list = await this.app.mysql.query('select * from `clubs` where ip_id = 1002 limit '+limit+','+pageSize);
		const count = await this.app.mysql.query('select count(*) as count from `clubs` where ip_id = ? ',[1002]);
		//console.log(count);
		var data = {};
		data.list = list;
		data.count = count[0].count;
		return data;
	  }

	  async setClubFocusPermissions(clubId,stauts){
			await this.app.mysql.query('update `clubs` set focus_permissions = ? where club_id = ?',[stauts,clubId]);
			return  true;
	  }
}

module.exports = UserService;
