<template>
    <div class="header_container">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-dropdown @command="handleCommand" menu-align='start'>
			<img src="../assets/avator.jpg" class="avator">
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="home">首页</el-dropdown-item>
				<el-dropdown-item command="singout">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
    </div>
</template>

<script>

    export default {
    	data(){
    		return {
    			
    		}
    	},
    	computed: {
    		
    	},
		methods: {
			async handleCommand(command) {
				if (command == 'home') {
					this.$router.push('/manage');
				}else if(command == 'singout'){
					this.$axios({
						method: "post",
						url: "/v1/account/quit",
					})
					.then(response => {
						if (response.data.code == 200) {
							this.$router.push('/');
						}
					})
					.catch(response => {});
				}
			},
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 20px;
		background-color: #20a0ff;
	}
	.el-dropdown-menu__item{
        text-align: center;
    }
</style>
