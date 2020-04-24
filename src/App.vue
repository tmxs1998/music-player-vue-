<template>
  <div id="app">
    <Header></Header>
    <Tab></Tab>
    <keep-alive include="recommend, singer, rank, search">
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
import Player from 'components/Player'
import Header from './components/Header'
import Tab from './components/Tab'
export default {
  components: { Header, Tab, Player }
}
</script>

<style lang="less" scoped>
@import './style/index.less';
  #app{
    background: @black2;
    .w(375);
    height: 100vh
  }
</style>
