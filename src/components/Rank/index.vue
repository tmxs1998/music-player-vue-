<template>
  <div class='rank'>
    <div class="wrapper" ref="wrapper">
      <ul class="content">
        <li v-for="(item, index) in rank" :key="index" @click='goRankDetail(item.id)'>
          <div>
            <img v-lazy="item.picUrl" alt="">
          </div>
          <ul>
            <li v-for="(litem,lindex) in item.songList" :key="lindex">
              {{lindex + 1}}.{{litem.songname}}-{{litem.singername}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 嵌套路由 -->
    <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import BS from 'better-scroll'
import { getRankData } from 'api/api.js'
export default {
  name: 'rank',
  data () {
    return {
      rank: ''
    }
  },
  methods: {
    initBs () {
      let wrapper = this.$refs.wrapper
      this.Bs = new BS(wrapper, {probeType: 3, click: true})
    },
    goRankDetail (rankID) {
      this.$router.push(`/rank/${rankID}`) // 跳转到排行列表页
    }
  },
  created () {
    getRankData().then((res) => {
      this.rank = res
      this.$nextTick(() => {
        this.initBs()
      })
    })
  },
}
</script>

<style lang="less" scoped>
@import '../../style/index.less';
.rank{
  position: fixed;
  top: 88px;
  bottom: 0;
  left: 0;
  right: 0;
  .wrapper{
    height: 100%;
    overflow: hidden;
    .content{
      .w(375);
      box-sizing: border-box;
      padding: 0 20px;
      >li{
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100px;
        padding-top: 20px;
        >div{
          width: 100px;
          height: 100px;
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        >ul{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: calc(100% - 140px);
          height: 100%;
          padding: 0 20px;
          li{
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            font-size: @fs-xs;
            color: rgba(255, 255, 255, .3);
          }
        }
      }
    }
  }
}
</style>
