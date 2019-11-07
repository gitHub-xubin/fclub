<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu theme="dark" :default-active="defaultActive" style="min-height: 100%;" background-color="#324057" text-color="#fff" active-text-color="#20a0ff" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-menu-item index="feedManager"><i class="el-icon-document"></i>明星管理</el-menu-item>
					<!-- <el-submenu index="2">
						<template slot="title"><i class="el-icon-document"></i>明星管理</template>
						<el-menu-item index="feedManager">微博动态</el-menu-item>
						<el-menu-item index="feedManager">应援团动态</el-menu-item>
						<el-menu-item index="feedManager">推送的动态</el-menu-item>
						<el-menu-item index="feedManager">置顶的动态</el-menu-item>
					</el-submenu> -->
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
export default {
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>


<style lang="less" scoped>
@import "../style/mixin";
.manage_page {
}
</style>
