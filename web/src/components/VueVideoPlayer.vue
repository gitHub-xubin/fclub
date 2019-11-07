<template>
  <div class="player">
    <d-player :options="playerOptions" ref="player" @touchend="clickHandler"></d-player>
  </div>
</template>
<style>
  .player {
    height: 100%;
  }
  .dplayer {
    height: 100%
  }
  .dplayer-setting {
    display: none!important;
  }
  .dplayer-menu.dplayer-menu-show {
    display: none!important;
  }
</style>

<script>
  import VueDPlayer from 'vue-dplayer'
  import 'vue-dplayer/dist/vue-dplayer.css'
  
  export default {
    name: 'VueVideoPlayer',
    props: ['src', 'poster'],
    data() {
      return {
        playerOptions: {
          preload: 'auto',
          video: {
            url: this.src,
            pic: this.poster,
            thumbnails: this.poster, 
            type: 'auto'
          }
        },
      }
    },
    methods: {
      clickHandler() {
        this.$refs.player.dp.toggle()
      }
    },
    components: {
      'd-player': VueDPlayer
    }
  }
</script>


