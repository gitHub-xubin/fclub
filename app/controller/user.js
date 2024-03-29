'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
	async userList(){
		const ctx = this.ctx;
		const page = ctx.request.body.page;
		const pageSize = ctx.request.body.pageSize;
		const res = await ctx.service.userService.getLists(page,pageSize);
		ctx.success(		
			res		
		);
	  }

	  async clubList(){
		const ctx = this.ctx;
		const page = ctx.request.body.page;
		const pageSize = ctx.request.body.pageSize;
		const res = await ctx.service.userService.getclubList(page,pageSize);
		ctx.success(		
			res		
		);
	  }

	  async setClubFocusPermissions(){
		const ctx = this.ctx;
		const clubId = ctx.request.body.clubId;
		const status = ctx.request.body.status;
		await ctx.service.userService.setClubFocusPermissions(clubId,status);
		ctx.success('success');
	  }
}

module.exports = UserController;
