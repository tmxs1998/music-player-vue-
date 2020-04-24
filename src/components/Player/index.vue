<template>
  <div class="player" v-if='songList.length'>
    <div v-show='fullScreen' class="big">
      <!-- 头部 -->
      <div class="top">
        <span @click='changeScreen(false)' class="iconfont icon-Group"></span>
        <h3>{{currentSong.songname}}</h3>
      </div>
      <!-- 背景 -->
      <div class="bg">
        <img :src="currentSong.albumUrl" alt="">
      </div>
      <!-- 歌手 -->
      <p class="name">{{currentSong.singer[0].name}}</p>
      <!-- 专辑图片 -->
      <div class="img">
          <img :class="cd" :src="currentSong.albumUrl" alt="">
      </div>
      <!-- 歌词 -->
      <Lyric :startTime='startTime' :play='play'></Lyric>
      <!-- 进度条 -->
      <MyProgress :startTime='startTime' :endTime='endTime' @seekFa='seek'></MyProgress>
      <!-- 播放 -->
      <div class="playBtn">
        <span @click="changeLoop">{{loops[loop]}}</span>
        <span  @click='prev' class="iconfont icon-shangyishou"></span>
        <span @click='togglePlay' :class="playStop"></span>
        <span @click='next' class="iconfont icon-xiayishou"></span>
        <span :class="aixin"></span>
      </div>
      <!-- 播放器 -->
      <audio ref='audio' @ended="ended" @canplay="canplay" @timeupdate="timeupdate"  :src="currentSong.audioUrl"></audio>
    </div>
    <!-- 小窗口 -->
    <div v-show="!fullScreen" class="small" @click="changeScreen(true)">
      <img :class="cd" :src="currentSong.albumUrl" alt="">
      <div>
        <p class="songname">{{currentSong.songname}}</p>
        <span class="name">{{currentSong.singer[0].name}}</span>
      </div>
      <span @click.stop='togglePlay' :class="playStop"></span>
    </div>
  </div>
</template>

<script>
import MyProgress from 'components/Progress'
import Lyric from 'components/Lyric'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  components: { MyProgress, Lyric },
  data () {
    return{
      startTime: 0,
      endTime: 0,
      loops: ['不循环', '单曲循环', '列表循环', '随机循环'],
      play: false,
      like: true
    }
  },
  computed: {
    ...mapState(['songList', 'fullScreen', 'loop']),
    ...mapGetters(['currentSong']),
    cd () {
      return this.play? 'cd': 'cd paused'  // 判断play的值改变图片class（控制图片是否旋转）
    },
    aixin () {
      return this.like? 'iconfont icon-xin': 'iconfont icon-xin1'
    },
    playStop () {
      return this.play? 'iconfont icon-zanting': 'iconfont icon-icon_play'
    }
  },
  methods: {
    ...mapMutations(['changeScreen', 'nextCurrentIndex','prevCurrentIndex','changeCurrentIndex','changeLoop']),
    togglePlay () {
      this.play = !this.play  // 当点击播放时取反值
    },
    timeupdate(e) {
      // 随着播放更新时间
      this.startTime = e.target.currentTime
    },
    canplay () {
      // 歌曲可以播放时
      this.audio = this.$refs.audio  // 获取用ref确定的audio元素
      this.audio.play()  // 调用audio的方法播放音乐
      this.play = true  // 将播放的属性改为true
      this.endTime = this.audio.duration // 获取歌曲的总时长
    },
    seek(s) {
      if(!this.audio) { return false }
      this.audio.currentTime = s 
    },
    ended () {
      this.play = false // 将play属性改为false
      switch (this.loop) {
        case 1:
          // 单曲循环
          this.play = true  // 将play属性改为true
          this.audio.play()  // 控制audio的方法播放音乐
          break;
        case 2:
          // 列表播放（相当于下一曲）
          this.nextCurrentIndex()
          break;
        case 3:
          // 随机播放
          let count = this.songList.length
          let index = parseInt(Math.random() * count)
          this.changeCurrentIndex(index)
        default:
          break;
      }
    },
    next () {
      // 下一曲
      this.nextCurrentIndex() // 调用全局
    },
    prev () {
      this.prevCurrentIndex() // 调用全局
    }
  },
  watch: {
    play (newValue, oldValue) {
      // 监听play值的变化
      if(!this.audio) return false  // 当歌曲不可播放时
      if(newValue) {
        this.audio.play()  // 调用audio方法播放音乐
      } else {
        this.audio.pause()  // 调用audio方法暂停音乐
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~style/index.less';
.player{
  color: #fff;
  .big{
    position: fixed;
    top:0px;
    bottom: 0px;
    left:0;
    right:0;
    background: #222;
    .top{
      position: relative;
      font-size: @fs-l;
      text-align: center;
      color: goldenrod;
      text-shadow: 2px 2px 2px grey;
      span{
        position: absolute;
        left: 10px;
        top: 10px;
      }
      h3{
        text-align: center;
      }
    }
    .name{
      font-size: @fs-s;
      text-align: center;
      padding: 10px;
      color: goldenrod;
      text-shadow: 2px 2px 2px grey;
    }
    .bg{
      position: absolute;
      z-index: -9;
      top: 0px;
      width: 100%;
      height: 100%;
      filter: blur(10px);
      img{
        width: 100%;
        height: 100%;
      }
    }
    .img{
      .w(375);
      padding: 30px;
      box-sizing: border-box;
      img{
        margin: 0 auto;
        width: 80%;
        border-radius: 50%;
        border: 10px solid #ccc; 
      }
      & .cd{
        animation: rotate 10s linear infinite;
      }
      & .paused{
        animation-play-state: paused;
      }
    }
    .lyric{
      margin: 0 auto;
      padding: 10px 0;
      width: 90%;
      height: 30px;
      text-align: center;
      font-size: @fs-m;
      text-shadow: 2px 2px 2px grey;
    }
    .progress{
      margin-top: 30px;
    }
    .playBtn{
      margin-top: 50px;
      .w(375);
      height: 30px;
      display: flex;
      justify-content: space-around;
      span{
        font-size: @fs-s;
        line-height: 30px;
        color: @yellow;
        text-shadow: 1px 1px 3px gray;
      }
      span:nth-of-type(n+2){
        font-size: 30px;
      }
      span:last-of-type{
        color: red;
      }
    }
  }
  .small{
    padding: 10px;
    position: fixed;
    bottom: 0px;
    .w(375);
    height: 60px;
    background: #333333;
    box-sizing: border-box;
    img{
      float: left;
      width: 40px;
      height: 40px;
      border: solid 2px gray;
      box-sizing: border-box;
      border-radius: 50%;
    }
    & .cd{
      animation: rotate 10s linear infinite;
    }
    & .paused{
      animation-play-state: paused;
    }
    >div{
      float: left;
      width: 60%;
      margin: 0 10px;
      p{
        font-size: @fs-m;
        text-shadow: 1px 1px 1px grey;
        color: goldenrod;
      }
      span {
        text-shadow: 1px 1px 1px grey;
      }
    }
    >span{
      line-height: 40px;
      font-size: @fs-xxl;
      text-shadow: 1px 1px 1px grey;
    }
  }
  @keyframes rotate {
    0% {
     transform: rotate(0deg)
    }
    100%{
      transform: rotate(360deg)
    }
  }
}  
</style>