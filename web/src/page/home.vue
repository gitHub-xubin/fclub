<template>
    <div class="dashboard-editor-container">
        <head-top></head-top>
        <div>
            <div class="title">欢迎进入速报酱后台管理系统</div>
            <img class="emptyGif" :src="emptyGif">
        </div>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    export default {
    	data(){
    		return {
                emptyGif: "https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3"
    		}
    	},
    	components: {
    		headTop,
    	},
    	mounted(){
    		
    	},
        computed: {

        },
    	methods: {
    		
    	}
    }
</script>

<style lang="less" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
    width: 100%;
    height: 100%;
    background-color: #e3e3e3;
    .title  {
        font-size: 48px;
        line-height: 48px;
        color: #20a0ff;
        margin-top: 50px;
        text-align: center;
    }
}
</style>