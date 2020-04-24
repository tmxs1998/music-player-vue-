<template>
  <div class="recommend">
    <div class="wrapper" ref='wrapper'>
      <div class="content">
        <banner :list='picData'></banner>
        <div class="title">歌曲列表推荐</div>
        <ul class="musicList">
          <li v-for='(item, index) in recommendList' :key='index'>
            <div class="left">
              <img v-lazy="item.imgurl" alt="">
            </div>
            <div class="right">
              <p>{{item.creator.name}}</p>
              <p>{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '../Banner'
import { getBannerData, getRecommendData } from '../../api/api'
import BS from 'better-scroll'
export default {
  name: 'recommend',
  components: { Banner },
  data () {
    return {
      picData: [],
      recommendList: []
    }
  },
  methods: {
    initBs () {
      let wrapper = this.$refs.wrapper
      new BS(wrapper, {})
    }
  },
  mounted () {
    getBannerData().then((res) => {
      this.picData = res.data.slider
    })
    getRecommendData().then((res) => {
      this.recommendList = res.data.list
    })
    this.initBs()
  }
}
</script>

<style lang="less" scoped>
@import '../../style/index.less';
.recommend{
  .wrapper{
    position: fixed;
    top: 88px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: auto;
    .content{
      .w(375);
      .title{
        .w(375);
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: @fs-s;
        color: @yellow;
      }
      .musicList{
        li{
          display: flex;
          .w(375);
          height: 82px;
          box-sizing: border-box;
          padding: 0 20px 20px 20px;
          border-bottom: solid 1px @black2;
          .left{
            width: 82px;
            height: 60px;
            img{
              width: 60px;
              height: 60px;
            }
          }
          .right{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            color: rgba(255, 255, 255, .5);
            font-size: @fs-s;
            p:first-child{
              color: rgb(255, 255, 255);
            }
          }
        }
      }
    }
  }
}
</style>
