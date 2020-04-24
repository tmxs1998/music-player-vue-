<template>
  <div class="Tab">
    <router-link to='/recommend' tag='div' active-class='sel'>
      <span>推荐</span>
    </router-link>
    <router-link to='/singer' tag='div' active-class='sel'>
      <span>歌手</span>
    </router-link>
    <router-link to='/rank' tag='div' active-class='sel'>
      <span>排行</span>
    </router-link>
    <router-link to='/search' tag='div' active-class='sel'>
      <span>搜索</span>
    </router-link>
  </div>
</template>

<style lang="less" scoped>
@import '../../style/index.less';
.Tab{
  .w(375);
  height: 44px;
  display: flex;
  div{
    width: 25%;
    line-height: 44px;
    font-size: @fs-m;
    text-align: center;
    color: rgba(255, 255, 255, .5);
    span{
      display: inline-block;
      line-height: 30px;
      border-bottom: 2px solid @black2;
    }
  }
  .sel{
    color: @yellow;
    span{
      border-bottom: 2px solid @yellow;
    }
  }
}
</style>
