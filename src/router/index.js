import Vue from 'vue'
import VueRouter from 'vue-router'
const Recommend = () => import('components/Recommend')
const Singer = () => import('components/Singer/index.vue')
const Rank = () => import('components/Rank')
const My = () => import('components/My')
const Detail = () => import('components/Detail')
const RankDetail = () => import('components/RankDetail')
const Search = () => import('components/Search')
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      name: 'recommend',
      path: '/recommend',
      component: Recommend
    },
    {
      name: 'singer',
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':singermid',
          name: 'detail',
          component: Detail
        }
      ]
    },
    {
      name: 'rank',
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':rankid',
          name: 'rankdetail',
          component: RankDetail
        }
      ]
    },
    {
      name: 'search',
      path: '/search',
      component: Search
    },    
    {
      name: 'my',
      path: '/my',
      component: My
    },
    {
      path: '/',
      redirect: '/recommend'
    }
  ]
})

export default router
