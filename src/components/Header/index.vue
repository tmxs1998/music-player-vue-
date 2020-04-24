<template>
  <div class="header">
    <img src="/favicon.ico" alt="">
    <span>My Music</span>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
@import '../../style/index.less';
.header{
  color: @yellow;
  font-size: @fs-l;
  display: flex;
  justify-content: center;
  align-items: center;
  .w(375);
  height: 44px;
  img{
    width: @fs-l;
    height: @fs-l;
  }
}
</style>
