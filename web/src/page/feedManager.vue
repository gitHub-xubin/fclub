<template>
    <div class="container">
        <head-top></head-top>
        <div>
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="用户">
					<el-input v-model="formInline.searchUser" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<el-input v-model="formInline.searchContent" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">搜索</el-button>
				</el-form-item>
			</el-form>
            <el-tabs v-model="activeName" v-loading="loading" style="width:90%;margin-left:30px;"  @tab-click="tabsClick">
				<el-tab-pane name="1" label="微博动态"><feed-tabel :data="wbData" :type="1"></feed-tabel></el-tab-pane>
				<el-tab-pane name="2" label="应援团动态"><feed-tabel :data="clubData" :type="2"></feed-tabel></el-tab-pane>
				<el-tab-pane name="3" label="推送的动态"><feed-tabel :data="pushData" :type="3"></feed-tabel></el-tab-pane>
				<el-tab-pane name="4" label="置顶的动态"><feed-tabel :data="topData" :type="4"></feed-tabel></el-tab-pane>
				<el-tab-pane name="5" v-if="showSearchTab" label="搜索结果"><feed-tabel :data="searchData" :type="5"></feed-tabel></el-tab-pane>
			</el-tabs>
            <div class="block">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="10"
					:current-page="page"
                    layout="prev, pager, next, jumper"
                    :total="counts">
                </el-pagination>
            </div>
			<div style="height:30px;"></div>
        </div>
    </div>
</template>

<script>
import headTop from "../components/headTop";
import feedTabel from "../components/feedTabel";
export default {
	data() {
		return {
			loading: false,
			activeName: "1",
			tabsIndex: 1,
			formInline:{
				searchUser: "",
				searchContent: ""
			},
			wbData: [], //微博动态
			clubData: [], //应援团动态
			pushData: [], //推送的动态
			topData: [], //置顶的动态
			searchData: [], //搜索结果
			page: 1, //页码
			counts: 0,//总条数
			pagesize: 10,
			showSearchTab: false,//显示搜索
            ips: [],
            currentIpId: null, // 当前的 ip_id
		};
	},
//    event: 'refresh-feed',
	components: {
		headTop,
		feedTabel
	},
	mounted() {
	    this.getIpList()
            .then( ips => {
                this.ips = ips;
                this.selectDefaultIp();
            });
//	    this.$emit('click');
	},
	methods: {
//        refreshFeed() {
//            console.log('on refreshFeed');
//            this.getFeedList(1,1);
//        },

	    selectDefaultIp() {
	        const ips = this.ips;
	        if (!ips.length) {
	            return;
            }
            const ip = ips[0];
	        this.currentIpId = ip.ip_id;
//	        this.$emit('refresh-feed');
            this.getFeedList(1,1);
        },

	    getIpList() {
            return this.$axios({
                url: "/v1/privilege/ip_list",
            }).then( resp => {
                return resp.data.data;
            });
        },

		getFeedList(type, page) {
			this.loading = true,
			this.$axios({
				method: "get",
				url: "/v1/feed/query_feeds",
				data: {
					ip_id: this.currentIpId,
					page: page,
					count: this.pagesize,
					type: type
				}
			})
			.then(response => {
				if (response.data.code == 200) {
					this.loading = false
					if (type == 1) {
						this.wbData = response.data.data.ret
					} else if (type == 2) {
						this.clubData = response.data.data.ret
					} else if (type == 3) {
						this.pushData = response.data.data.ret
					} else if (type == 4) {
						this.topData = response.data.data.ret
					}
					this.counts = response.data.data.counts
				}
			})
			.catch(response => {});
		},
		/**
		 * 切换顶部tab
		 */
		tabsClick(tab, event) {
			this.page = 1
			this.tabsIndex = parseInt(tab.index) + 1
			if(this.tabsIndex!=5) {
				this.showSearchTab = false
				this.getFeedList(this.tabsIndex, 1);
			}
		},
		/**
		 * 点击分页页码
		 */
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			console.log(`this.tabsIndex:`,this.tabsIndex);
			this.page = val
			if(this.tabsIndex!=5) {
				this.getFeedList(this.tabsIndex,val);
			} else {
				this.getSearchFeedList(val)
			}
		},
		/**
		 * 搜索
		 */
		onSubmit() {
			this.page = 1
			this.tabsIndex = 5
			this.showSearchTab = true
			this.activeName = "5"
			this.getSearchFeedList(1)
		},
		getSearchFeedList(page) {
			this.$axios({
				method: "get",
				url: "/v1/feed/search",
				data: {
					ip_id: "1000",
					page: page,
					count: this.pagesize,
					user_keyword: this.formInline.searchUser,
					feed_keyword: this.formInline.searchContent
				}
			})
			.then(response => {
				if (response.data.code == 200) {
					this.searchData = response.data.data.ret;
					this.counts = response.data.data.counts
				}
			})
			.catch(response => {});
		},
	}
};
</script>

<style lang="less" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.container {
  width: 100%;
  height: 100%;
}
.input {
  width: 500px;
}
.block {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 30rpx;
}
.demo-form-inline{
	margin-top: 20px;
	margin-left: 30px;
}
</style>