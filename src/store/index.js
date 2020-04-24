import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    songList: [],  // 歌曲列表
    fullScreen: true,  // 是否全屏 
    currentIndex: -1,  // 当前播放歌曲的索引 
    loop: 0  // 0 不循环 1 单曲 2 顺序 3 随机
  },
  mutations: {
    changeScreen (state, screenState) {
      state.fullScreen = screenState  // 控制屏幕的大小
    },
    addSongList (state, params) {
      state.songList = params  // 更新要播放的歌曲列表 
    },
    changeCurrentIndex (state, index) {
     state.currentIndex = index  // 更新当前播放的歌曲 
    },
    nextCurrentIndex(state){  // 下一首
      let count = state.songList.length 
      if(state.currentIndex < count-1){
        // 小于长度下标的时候歌曲下一曲
        state.currentIndex++
      }else{
        state.currentIndex=0
      }
    },
    prevCurrentIndex(state){  // 上一曲
      let count = state.songList.length  
      if(state.currentIndex>0){
        // 下标大于0的时候向前
        state.currentIndex--
      }else{
        state.currentIndex=count-1
      }
    },
    changeLoop(state){
      // 修改循环模式
      if(state.loop==3){
        state.loop=0
      }else{
        state.loop++
      }
    }
  },
  getters: {
    currentSong (state) {
      return state.songList[state.currentIndex] || null // 当前正在播放的那首歌
    }
  }
})

export default store
