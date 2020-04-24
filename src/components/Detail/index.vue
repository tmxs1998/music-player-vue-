<template>
  <div class="detail">
    <!-- 头部导航 -->
    <div class="top">
      <span @click='back' class='iconfont icon-fanhui'></span><h3>{{name}}</h3>
    </div>
    <!-- 歌手图片 -->
    <div class="avator" :style="{'background-image': `url(${avator})`}" ref='img'>
      <div class="shadow"></div>
    </div>
    <!-- 歌曲列表 -->
    <div class="songList" ref='wrapper'>
      <div class="content">
        <ul>
          <li v-for='(item, index) in list' :key='index' @click="openPlay(index)">
            <h2>{{item.songname}}</h2>    
            <p>{{name}}·{{item.albumname}}</p>
            
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BS from 'better-scroll'
import { getSongByMid, getSongUrlByMid } from 'api/api.js'
import { mapMutations } from 'vuex'
export default {
  data () {
    return{
      list: [],  // 初始化列表
      name: '暂无',  // 初始化歌手名字
      avator: ''  // 初始化歌手图片
    }
  },
  methods: {
    ...mapMutations(['addSongList', 'changeCurrentIndex', 'changeScreen']),
    back () {
      this.$router.go(-1)  // 返回音乐列表页
    },
    openPlay (index) {
      this.addSongList(this.list) // 点击歌名显示音乐播放器
      this.changeCurrentIndex(index) // 确定当前点击的是哪一首歌
      this.changeScreen(true) // 点击时放大
    },
    initBs () {
      let img = this.$refs.img  // 获取歌手图片dom元素
      let imgH = img.clientHeight  // 获取该元素的高度
      let wrapper = this.$refs.wrapper  // 获取wrapper元素
      this.bs = new BS(wrapper, {probeType: 3, click: true})  // 将实例挂载到this上，并使用插件的方法
      this.bs.on ('scroll', ({y}) => {
        // 监听wrapper块滚动，并实时获取y坐标
        if(y >= 0) { // 当向下滑动时图片放大
          let precent = 1 + (y / imgH)  // 保存放大的比例
          img.style.transform = `scale(${precent})`  // 将图片按比例放大
          img.style.zIndex = 1  // 调整图片层级
        } else {
          // 当列表向上滚动时，没有到达顶部列表层级高，到达顶部时图片层级高
          if(Math.abs(y) > imgH - 40) { // 判断是否滑动到据页面顶部40px的位置
            img.style.zIndex = 1  // 改变img层级
            img.style.paddingTop = '0%' // 改变图片上边距
            img.style.height = '40px'  // 改变图片高度
          } else {
            img.style.zIndex = -1  // 改变img层级
            img.style.paddingTop = '70%' // 改变图片上边距
            img.style.height = 0  // 改变图片高度
          }
        }
      })
    },
    handleList (list) {
      let result = [] // 初始化结果数组
      let mids = [] // 初始化id数组
      result = list.map((item, index) => {
        let {albummid, albumname, singer, songmid, songname} = item.musicData // 从数据中剥取需要的数据并保存
        // 拼接图片地址
        let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
        mids.push(songmid) // 向mid列表中添加歌曲id
        // 将遍历到数据返回
        return { albummid, albumname, singer, songmid, songname, albumUrl } 
      })
      return { result, mids } // 返回列表全部信息
    }
  },
  async created () { // 将created生命周期变为异步
    let  { singermid } = this.$route.params // 获取路径参数中的歌手id
    let data = await getSongByMid(singermid)  // 根据歌手id发起请求获取数据
    let { result, mids } = this.handleList(data.data.list) // 将获得的列表数据再加工
    let { urls } = await getSongUrlByMid(mids) // 保存歌曲的地址
    let finalData = []
    for(let index = 0; index < result.length; index++) {
      result[index].audioUrl = urls[index] // 将音乐地址一并加入result数组
      if(urls[index]) {
        finalData.push(result[index])  // 将不能播放（无法获取到播放地址的）歌曲去除
      }
    }
    this.list = finalData // 更新list数组为获取到的数组
    this.name = data.data.singer_name  // 更新name为当前数据中的歌手名字
    // 拼接并更新图片地址
    this.avator = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singermid}.jpg?max_age=2592000`
    this.$nextTick(() =>{
        this.initBs() // 待数据更新完毕再初始化插件
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../style/index.less';
.detail{
  position: fixed;
  top: 0px;
  bottom: 0px;
  background: @black2;
  left:0px;
  right: 0px;
  // 头部
  .top{
    .w(375);
    height: 40px;
    color: #fff;
    text-shadow: 2px 2px 2px gray;
    position: absolute;
    top:0;
    z-index: 3;
    span{
      position: absolute;
      left: 2px;
      top: 2px;
      line-height: 40px;
      font-size: @fs-xl;
    }
    h3{
      font-size: @fs-l;
      text-shadow: 2px 2px 2px gray;
      text-align: center;
      line-height: 40px
    }
  }
  // 头像
  .avator{
    .w(375);
    padding-top: 70%;
    background-size:cover; 
    position: absolute;
    top: 0px;
    z-index: -1;
    .shadow{
      position: absolute;
      top: 0;
      background: rgba(7,17,27,0.3);
      width: 100%;
      height: 100%;
    }
  }
  // 歌曲列表
  .songList{
   position: fixed;
   background: @black2;
  //  overflow: hidden;
   top:270px;
   bottom: 0px;
   left:0;
   right: 0;
   .content{
     padding: 10px 30px;
     background: @black2;
     li{
       font-size: @fs-s;
       color: #fff;
       margin-bottom: 10px;
       h2{
        display: inline-block;
        height: 20px;
        padding: 1px 0;
        font-size: @fs-m;
       }
       p{
        margin-top: 5px; 
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        color: rgba(255,255,255,.3);
       }
     }
   }
  }
}
</style>
