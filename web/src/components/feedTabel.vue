<template>
    <el-table :data="data" style="width: 100%;color: #282828" row-key="id" :expand-row-keys="expands" @row-click="rowClick">
        <el-table-column type="expand">
            <template slot-scope="props">
                <div class="props_item" v-if="props.row.content">
                    <div class="item_title">内容正文：</div>
                    <div class="item_content">{{props.row.content}}</div>
                </div>
                <div class="props_item margin-top-20" v-if="props.row.images">
                    <div class="item_title">图片：</div>
                    <div class="images">
                        <el-popover placement="right" title="" trigger="hover" v-for="(item, index) in getImages(props.row.images)" :key="index">
                            <img :src="$url(item)" style="max-height: 500px;max-width: 500px"/>
                            <img slot="reference" class="img" :src="$url(item, '?imageView2/1/w/50/h/50')"  :alt="$url(item, '?imageView2/1/w/50/h/50')"> 
                        </el-popover>
                    </div>
                </div>
                <div class="props_item margin-top-20" v-if="props.row.video">
                    <div class="item_title">视频：</div>
                    <div class="video">
                        <VueVideoPlayer style='width:300px;height:200px' :src="$url(getVideo(props.row.source, props.row.video))" :poster="$url(getPoster(props.row.source, props.row.video))"></VueVideoPlayer>
                    </div>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="ID" width="120px" prop="id"></el-table-column>
        <el-table-column label="用户" width="200px">
            <template slot-scope="scope">
                <div class="name">{{scope.row.user?scope.row.user.nickname:scope.row.ip_info?scope.row.ip_info.name:''}}</div>
                <div>{{$formatDate(scope.row.create_time,2)}}</div>
                <div>来自{{scope.row.source==2?'微博':scope.row.club?scope.row.club.name:''}}</div>
            </template>
        </el-table-column>
        <el-table-column label="内容">
            <template slot-scope="scope">
                <div class="content">{{scope.row.content}}</div>
                <div class="comment_num">
                    <div>点赞数：{{scope.row.like_cnt}}</div>
                    <div style="margin-left:30px">评论数：{{scope.row.comment_cnt}}</div>
                </div>
            </template>
        </el-table-column>
        <el-table-column width="200px" label="操作">
            <template slot-scope="scope">
                <el-button class="opt" v-if="(type==1||type==2||type==3)&&scope.row.recommend_state==2" size="mini" @click="pushFeed(scope.row.id, 0, scope.$index)">取消推送</el-button>
                <el-button class="opt" v-if="(type==1||type==2||type==3)&&scope.row.recommend_state==1" size="mini" @click="pushFeed(scope.row.id, 1, scope.$index)">推送</el-button>
                <el-button class="opt" v-if="(type==3||type==4)&&scope.row.is_top_home==0" size="mini" @click="topFeed(scope.row.id, 1, scope.$index)">置顶</el-button>
                <el-button class="opt" v-if="(type==3||type==4)&&scope.row.is_top_home==1" size="mini" @click="topFeed(scope.row.id, 0, scope.$index)">取消置顶</el-button>
                <el-button class="opt" v-if="type==2" size="mini" type="danger" @click="deleteFeed(scope.row.id, scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import VueVideoPlayer from "./VueVideoPlayer";
export default {
    props: {
        type: {
            type: Number,
            default: 0,
        },
        data: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            // 要展开的行，数值的元素是row的key值
            expands: []
        };
    },
    components: {
        VueVideoPlayer
    },
    mounted(){
        
    },
    methods: {
        //在<table>里，我们已经设置row的key值设置为每行数据id：row-key="id"
        rowClick(row, event, column) {
            Array.prototype.remove = function (val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };

            if (this.expands.indexOf(row.id) < 0) {
                this.expands = []
                this.expands.push(row.id);
            } else {
                this.expands.remove(row.id);
            }
        },
        /**
         * 推送
         */
        pushFeed(feedId, opt, index){
            this.$axios({
				method: "post",
				url: "/v1/feed/push_to_hostpage",
				data: {
                    feed_id: feedId,
                    opt: opt
				}
			})
			.then(response => {
				if (response.data.code == 200) {
					this.data[index].recommend_state = opt == 1 ? 2 : 1
                    this.$notify({
                        title: opt==1?'推送成功':"取消推送成功",
                        type: 'success'
                    });
				}
			})
			.catch(response => {});
        },
        /**
         * 置顶
         */
        topFeed(feedId, opt, index){
            this.$axios({
				method: "post",
				url: "/v1/feed/top_one",
				data: {
                    feed_id: feedId,
                    opt: opt
				}
			})
			.then(response => {
				if (response.data.code == 200) {
                    this.data[index].is_top_home = opt
                    this.$notify({
                        title: opt==1?'置顶成功':"取消置顶成功",
                        type: 'success'
                    });
				}
			})
            .catch(response => {});
        },
        /**
         * 删除
         */
        deleteFeed(feedId, index){
            this.$confirm('删除后不可再恢复, 是否继续?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$axios({
                    method: "post",
                    url: "/v1/feed/delete_feed",
                    data: {
                        feed_id: feedId,
                        opt: 1
                    }
                })
                .then(response => {
                    if (response.data.code == 200) {
                        this.data.splice(index,1)
                        this.$notify({
                            title: '删除成功',
                            message: '',
                            type: 'success'
                        });
                    }
                })
                .catch(response => {});
            }).catch(() => {
                this.$notify.info({
                    title: '已取消删除',
                    message: ''
                });
            });
        },
        /**
         * 图片分隔
         */
        getImages(images){
            return images.split(",")
        },
        /**
         * 视频处理
         */
        getVideo(source, video){
            if(video){
                var videoObj = JSON.parse(video)
                return videoObj.url
            } else {
                return ''
            }
        },
        /**
         * 视频封面图
         */
        getPoster(source, video){
            if(video){
                var videoObj = JSON.parse(video)
                if(source == 1){
                    return videoObj.url + '?vframe/jpg/offset/1/w/300/h/200'
                } else {
                    return videoObj.cover + '?imageView2/1/w/300/h/200'
                }
            } else {
                return ''
            }
        }
    }
}
</script>

<style>
.margin-top-20{
    margin-top: 20px;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
.name{
    color: #282828;
    font-weight: bold;
    font-size: 20px;
}
.content{
    height: 40px;
    line-height: 20px;
    overflow: hidden;
}
.comment_num{
    display: flex;
    flex-direction: row;
    margin-top: 5px;
}
.opt{
    width: 80px;
}
.props_item{
    display: flex;
}
.item_title{
    font-weight: bold;
    width: 100px;
}
.item_content{
    flex: 1;
}
.images{
    display: flex;;
}
.images .img{
    margin-right: 20px;
}
</style>
