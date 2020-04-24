<template>
  <div class="singers">
    <!-- 歌手列表 -->
    <div class="wrapper" ref='singerWrapper'>
      <div class="content">
        <ul>
          <li v-for='(item, index) in singers' :key='index' :ref='item.Findex'>
            <!-- 每一组的首字母 -->
            <h4>{{item.Findex}}</h4>
            <!-- 首字母下的歌手信息 -->
            <ol>
              <li v-for='(sItem, sIndex) in item.list' :key='sIndex' @click='goDetail(sItem.Fsinger_mid)'>
                <img v-lazy="sItem.avator" alt="">
                <span>{{sItem.Fsinger_name}}</span>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    </div>
    <!-- end 歌手列表 -->
    <!-- 导航列表 -->
    <div class='quickNav'>
      <ul @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
        <li v-for='(item, index) in quickData' :key='index' @click='quickJump(item)' :class='selFindex==item?"sel":""'>
          {{item}}
        </li>
      </ul>
    </div>
    <!-- end 导航列表 -->
    <!--嵌套路由 -->
    <transition
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
    >
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import BS from 'better-scroll'
import { getSingersData } from 'api/api.js'
import { dealData } from './index'
export default {
  name: 'singer',
  data () {
    return { 
      singers: [],
      selFindex: 'hot'  // 当前选中的首字母
    }
  },
  methods: {
    goDetail (Fsinger_mid) {
      this.$router.push(`/singer/${Fsinger_mid}`) // 跳转到歌手歌曲列表页
    },
    touchStart (e) {  // 当手指按下时
      let y = e.touches[0].pageY  // 保存按下时的y坐标
      let startCount = parseInt((y - 140) / 18) // 确定当前点击的是第几个导航块
      this.touch.y = y
      this.touch.startCount = startCount
    },
    touchMove (e) {  // 当手指移动时
      let moveY = e.touches[0].pageY  // 获得手指移动时的y坐标
      let moveDis = moveY - this.touch.y  // 将当前y坐标与按下时的初始坐标相减
      let count = parseInt(moveDis / 18)  // 用距离除以每一个首字母li的高度
      let moveIndex = this.touch.startCount + count  // 保存当前索引
      if(moveIndex < 0 || moveIndex > this.quickData.length - 1){  // 控制边界
        return false
      }
      let moveFindex = this.quickData[moveIndex]  // 使用索引获得当前滑动到的块的首字母
      this.quickJump(moveFindex)  // 调用滚动方法
    },
    touchEnd () {  // 当手指离开时

    },
    quickJump (item) {  // 当点击导航栏首字母时
      let dom = this.$refs[item][0]  // 根据首字母取到元素
      this.Bs.scrollToElement(dom)  // 使用better-scorll插件内部方法直接跳转到固定元素
    },
    initBs () {
      let wrapper = this.$refs.singerWrapper  // 使用$refs获取dom元素 防止出错
      this.Bs = new BS(wrapper, {probeType: 3, click: true})  // 将插件挂载到组件中
      let distance = []  // 设置距离数组
      for(const key in this.$refs) {  // 循环每一个ref标记的元素
        if(key !== 'singerWrapper') {  // 去除无关元素
          distance.push(this.$refs[key][0].offsetTop)  // 像数组中存入当前元素最上面的坐标
        }
      }
      this.Bs.on('scroll', (pos) => {  // 监听滚动 调用插件方法，当滚动发生获得坐标pos
        let y = Math.abs(pos.y)  // 因为向下滑动会得到负值，所以将该值的绝对值保存
        let scrollIndex = 0  // 设置滚动所在的区域初值

        for(let index = 0; index < distance.length; index++) {
          if(y >= distance[index] && y < distance[index + 1]){  // 判断当前滚动的距离在哪个范围内
            scrollIndex = index // 设置滚动所在区域下标为当前下标
          } else if (y >= distance[distance.length - 1]){  // 设置边界判断
            scrollIndex = distance.length - 1  // 设置滚动所在的索引为最后一个
          }
        }

        let scrollFindex = this.quickData[scrollIndex]  // 根据索引更换首字母列表位置
        this.selFindex = scrollFindex
      })
    }
  },
  computed: {
    // 创建导航数据并与singers数据关联
    quickData () {
      let result = this.singers.map((item) => {
        return item.Findex
      })
      return result // 返回存放首字母的数组
    }
  },
  created () {
    this.touch = { y: 0 } // 将移动距离挂载到this对象下
    getSingersData().then((res) => {  // 处理歌手数据
      let data = dealData (res.data.list)  // 获取整理好的数据
      this.singers = data  // 更改singers数组
      this.$nextTick(() => {
        this.initBs()  // 等待数据请求完毕且页面更新后再初始化
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import '~style/index.less'; // 在样式中使用别名使用波浪号
.singers{
  position: fixed;
  top:88px;
  bottom: 0px;
  left:0px;
  right: 0px;
  .quickNav{
    position: absolute;
    right: 10px;
    top:40px;
    width: 20px;
    background: rgba(0,0,0,.3);
    font-Size:@fs-xs;
    padding: 20px 0 20px;
    color:rgba(255,255,255,.5);
    border-radius:10px; 
    text-align: center;
    ul{
      li{
        width: 20px;
        height: 18px;
      }
      .sel{
        color: @yellow;
      }
    }
  }
  .wrapper{
    height: 100%;  
    overflow: hidden;
    .content{
      .w(375);
      h4{
        height: 30px;
        line-height: 30px;
        background: #333;
        color:rgba(255,255,255,0.5);
        font-size: @fs-s;
        padding-left:20px;
      }
      ol{
        li{
          .w(375);
          height: 70px;
          // background: pink;
          box-sizing: border-box;
          padding: 20px 0px 0px 30px;
          display: flex;
          align-items: center;
          img{
            width: 50px;
            height: 50px;
            border-radius:25px; 
          }
          span{
            padding-left:20px; 
            display: inline-block;
            height: 50px;
            line-height: 50px;
            font-size: @fs-s;
            color:rgba(255,255,255,.5);
          }
        }
      }
    }
  }
}
</style>
