<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>速报酱后台管理系统</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="用户名"><span>dsfsf</span></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="login" class="submit_btn">登录</el-button>
				  	</el-form-item>
				</el-form>
				<p class="tip"></p>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
export default {
	data() {
		return {
		loginForm: {
			username: "",
			password: ""
		},
		rules: {
			username: [
			{ required: true, message: "请输入用户名", trigger: "blur" }
			],
			password: [{ required: true, message: "请输入密码", trigger: "blur" }]
		},
		showLogin: false
		};
	},
	mounted() {
		this.showLogin = true;
	},
	computed: {},
	methods: {
		login() {
			if (!this.loginForm.username || !this.loginForm.password) {
				this.$notify.error({
				title: "错误",
				message: "请输入正确的用户名密码",
				offset: 100
				});
				return;
			}
			this.$axios({
				method: "post",
				url: "/v1/account/login",
				data: {
				account: this.loginForm.username,
				password: this.loginForm.password
				}
			})
			.then(response => {
				if (response.data.code == 200) {
					this.$setCookie('account',this.account)
					this.$setCookie('account_id',response.data.data.account_id)
					this.$router.push("manage");
				}
			})
			.catch(response => {});
		}
	},
	watch: {
		// adminInfo: function (newValue){
		// 	if (newValue.id) {
		// 		this.$message({
		//             type: 'success',
		//             message: '检测到您之前登录过，将自动登录'
		//         });
		// 		this.$router.push('manage')
		// 	}
		// }
	}
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  .wh(320px, 210px);
  .ctp(320px, 210px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
    margin-top: 20px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
