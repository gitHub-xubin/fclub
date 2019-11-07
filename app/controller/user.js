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
}

module.exports = UserController;