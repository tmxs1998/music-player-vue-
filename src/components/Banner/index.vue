<template>
  <div class='swiper-container'>
    <div class='swiper-wrapper'>
      <div class='swiper-slide' v-for='(item,index) in list' :key='index'>
        <img :src="item.picUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class='swiper-pagination'></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
export default {
  props: {
    'list': { type: Array, default: [] }
  },
  methods: {
    initBanner () {
      /* eslint-disable no-new */
      new Swiper('.swiper-container', {
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination'
        }
      })
    }
  },
  watch: {
    list () {
      this.$nextTick(() => {
        this.initBanner()
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../style/index.less';
@import '~swiper/css/swiper.min.css';
.swiper-container {
  .w(375);
  .h(150);
  background: green;
  img {
    .w(375);
    .h(150);
  }
}

</style>
