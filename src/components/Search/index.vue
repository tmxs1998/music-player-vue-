<template>
  <div class="search">
    <div class="searchBar">
      <div class="searchBox">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" placeholder="搜索歌曲、歌手" @input='changeList' v-model="searchtxt">
        <i v-if="!change" class="iconfont icon-jinakangbaoicons18" @click="deleteInput"></i>
      </div>
    </div>
    <div class="searchInfo" ref="wrapper">
      <div v-if="change" class="hot">
        <h2>热门搜索</h2>
        <ul>
          <li v-for="(item, index) in hotlist" :key="index" @click="hotClick(item.k)">
            <span >
              {{item.k}}
            </span>
          </li>
        </ul>
      </div>
      <div v-else class="searchList">
        <ul v-if='haveResult' class="content">
          <li v-if="toSingerDetail" @click="goDetail()">
            <i class="iconfont icon-daohanglan-05"></i>
            <span>{{singername}}</span>
          </li>
          <li v-for="(item, index) in searchresult" :key="index" @click="openPlay(index)">
            <i class="iconfont icon-yinle"></i>
            <span>{{item.songname}}-{{item.singer[0].name}}</span>
          </li>
        </ul>
        <div v-else class="sorry">
          抱歉，暂无搜索结果 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BS from 'better-scroll'
import { getHotSearch, getSearchList, getSongUrlByMid } from 'api/api.js'
import { mapMutations } from 'vuex'
export default {
  data () {
    name: 'search'
    return {
      change: true,
      hotlist: [],
      searchresult: [],
      searchtxt: '',
      toSingerDetail: false,
      haveResult: true,
      singermid: '',
      singername: ''
    }
  },
  methods: {
    ...mapMutations(['addSongList', 'changeCurrentIndex', 'changeScreen']),
    changeList () {
      if(this.searchtxt !== ''){
        this.change = false
        this.addlist(this.searchtxt)
      } else {
        this.change = true
      }
    },
    hotClick (text) {
      this.searchtxt = text.trim()
      this.searchresult = []
      this.singermid = ''
      this.singername = ''
      this.toSingerDetail = false
      this.change = false
      this.addlist(text)
    },
    deleteInput () {
      this.searchtxt = ''
      this.searchresult = []
      this.singermid = ''
      this.singername = ''
      this.change = true
    },
    async addlist (key) {
      let data = await getSearchList(key) 
      if(data.subcode == 10003){
        this.haveResult = false
      } else {
        this.haveResult = true
        let result = [] // 初始化结果数组
        let mids = [] // 初始化id数组
        if(data.data.zhida.type == 2){
          this.toSingerDetail = true
          this.singermid = data.data.zhida.singermid
          this.singername = data.data.zhida.singername
        } else {
          this.toSingerDetail = false
        }
        result = data.data.song.list.map((item, index) => {
          let {albummid, albumname, singer, songmid, songname} = item // 从数据中剥取需要的数据并保存
          // 拼接图片地址
          let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
          mids.push(songmid) // 向mid列表中添加歌曲id
          // 将遍历到数据返回
          return { albummid, albumname, singer, songmid, songname, albumUrl } 
        })
        let { urls } = await getSongUrlByMid(mids)
        let finalData = []
        for(let index = 0; index < result.length; index++) {
          result[index].audioUrl = urls[index] // 将音乐地址一并加入result数组
          if(urls[index]) {
            finalData.push(result[index])  // 将不能播放（无法获取到播放地址的）歌曲去除
          }
        }
        this.searchresult = finalData
        if(this.searchresult.length == 0) {
          this.haveResult = false
        }
        // 保存歌曲的地址
      }
    },
    goDetail () {
      this.$router.push(`/singer/${this.singermid}`) // 跳转到歌手歌曲列表页
    },
    openPlay (index) {
      this.addSongList(this.searchresult) // 点击歌名显示音乐播放器
      this.changeCurrentIndex(index) // 确定当前点击的是哪一首歌
      this.changeScreen(true) // 点击时放大
    },
    initBs () {
      let wrapper = this.$refs.wrapper  // 获取wrapper元素
      this.bs = new BS(wrapper, {probeType: 3, click: true})  // 将实例挂载到this上，并使用插件的方法
    }
  },
  async created () {
    await getHotSearch().then((res) => {
      this.hotlist = res.data.hotkey.slice(0,10)
    })
    this.$nextTick(() => {
      this.initBs() // 待数据更新完毕再初始化插件
    })
  }
}
</script>

<style lang="less" scoped>
@import '~style/index.less';
.search{
  position: fixed;
  top: 88px;
  bottom: 60px;
  left:0px;
  right: 0px;
  background: @black2;
  .searchBar{
    .w(375);
    height: 60px;
    padding: 10px 20px;
    box-sizing: border-box;
    .searchBox{
      width: 100%;
      height: 100%;
      background: #333333;
      i{
        float: left;
        width: 25px;
        height: 40px;
        line-height: 40px;
        font-size: @fs-s;
        text-align: center;
        color: rgba(255,255,255,.4);
        background: #333333;
      }
      input{
        float: left;
        width: calc(100% - 60px);
        height: 40px;
        font-size: @fs-s;
        font-weight: 400;
        text-indent: 5px;
        border: 0;
        outline: 0;
        color: rgba(255,255,255,.4);
        background: #333333;
      }
    }
  }
  .searchInfo{
    position: absolute;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    .hot{
      overflow: hidden;
      margin: 0 20px;
      >h2{
        margin: 10px 0;
        width: 100%;
        height: @fs-s;
        line-height: @fs-s;
        font-size: @fs-s;
        color: rgba(255,255,255,.4);
      }
      ul{
        width: 100%;
        height: 100%;
        li{
          display: inline-block;
          height: 18px;
          margin: 0 20px 10px 0;
          padding: 5px 10px;
          background: #333333;
          span{
            height: 100%;
            font-size: @fs-s;
            text-align: center;
            color: rgba(255,255,255,.4);
          }
        }
      }
    }
    .searchList{
      width: 100%;
      margin: 0 20px;
      .content{
        width: 100%;
        li{
          width: 100%;
          height: @fs-m;
          line-height: @fs-m;
          font-size: @fs-s;
          padding-bottom: 20px;
          white-space: nowrap;
          overflow: hidden;
          color: rgba(255,255,255,.4);
          i{
            display: inline-block;
            height: 16px;
            line-height: 16px;
            width: 30px;
          }
          span{
            display: inline-block;
            width: calc(100% - 30px);
            height: 16px;
            font-size: @fs-s;
          }
        }
      }
      .sorry{
        width: 100%;
        font-size: @fs-xl;
        color: rgba(255,255,255,.4);
      }
    }
  }
}
</style>
