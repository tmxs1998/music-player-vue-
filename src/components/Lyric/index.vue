<template>
  <div class="lyric">
    {{text}}
  </div>
</template>

<script>
import { getLyricByMid } from 'api/api.js'
import Lyric from 'lyric-parser'
import { Base64 } from 'js-base64'
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      text: '暂无歌词'  // 初始化歌词
    }
  },
  props: ['startTime', 'play'],
  computed: {
    ...mapGetters(['currentSong']),
    ...mapState(['currentIndex'])  // 引入全局方法
  },
  watch: {
    currentIndex () {
    },
    play(newValue,oldValue){
      if(this.lyricObj){
        this.lyricObj.togglePlay() // 控制歌词播放
      }
    },
    startTime(newValue,oldValue){
    },
    currentSong(newData,oldData){
      let { songmid } = newData  // 歌曲变化时改变当前歌曲id
      this.getLyric(songmid)     // 歌曲id改变 歌词同时改变
    }
  },
  methods: {
    getLyric (songmid) {
      getLyricByMid(songmid).then((data) => {
          let decode = Base64.decode(data.lyric) // 使用base64解码歌词
          if(this.lyricObj) {
            this.lyricObj.stop()  // 停止之前的歌词
            this.lyricObj = null  // 清空歌词列表
          }
          this.lyricObj = new Lyric(decode, ({txt}) => {
            this.text = txt // 调用插件方法，正则获得歌词时间轴
          })
          this.lyricObj.play()  // 播放当前歌词
      })
    }
  },
  mounted () {
    let { songmid } = this.currentSong // 获取当前播放的歌曲id
    this.getLyric(songmid) // 调用解析歌词的方法
  }
}
</script>
<style lang="less" scoped>
@import '~style/index.less';

</style>
