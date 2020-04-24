import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VueLazyload from 'vue-lazyload'
import './style/reset.css'
import 'animate.css/animate.css'
import '../public/font/iconfont.css'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/favicon.ico',
  loading: '/favicon.ico',
  attempt: 1
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
