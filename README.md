### 移动端适配（样式方面）

一套代码 在不同的设备上显示基本一样
百分比 媒体查询 flex rem
pc适配 媒体查询 + 百分比（栅格 栅栏）
移动适配 rem + flex
核心思路： 找页面尺寸和rem的关系

1. 将根元素的字体大小设置为屏幕宽度的1/10
2. 结合less的mixin实现适配

设计分辨率 iphone6s 375 * 667 750 * 1134

### 兼容问题 js

swiper 3 4 5（低版本iOS只能使用swiper3）
css h5 websocket

### 预处理语言 less sass stylus


### 命名规范

1. 文件夹的命名 小写字母连接符的命名方式 my-demo
2. 文件的命名   首字母小写字母 小驼峰 或者也是用连接符 myDemo.js my-demo.js
3. 组件和类文件 首字母大写 大驼峰 MyBanner.vue MyBanner.js
4. index.js    index.vue
   在模板中一个‘-’ + 小写字母 等同于 大写字母
   less-demo == lessDemo 

### 绝对路径的别名 alias

  chainWebpack: (config) => {
    config.resolve.alias
    .set('@', resolve('./src')) // src的绝对路径起别名为@
    .set('api', resolve('./src/api'))
    .set('style', resolve('./src/style'))
    .set('components', resolve('./components'))
  }

### vuex

全局状态管理 

1. 多组件共享状态 多个组件使用同一个数据
2. 任何一个组件发生改变 其他的组件也要跟着改变

### 基本使用

1. 创建全局状态管理实例
2. 注册
3. 在组件里使用全局状态值
   a.获取渲染全局状态值
   b.修改全局状态值

### 五大核心

state    全局状态数据
mutation 规定只有mutation才能修改state 通过commit方法触发
action   可以放异步操作 触发mutation 通过dispatch触发
getter   vuex里的计算属性 和state值进行关联 state发生改变
         可以重新计算，并且可以在页面上直接使用

### action 存放异步

1. 统一管理请求 减少代码量
2. 时间旅行 vue的开发者工具

### 最简单的使用

1. 组件里通过 $store.state获取全局状态数据进行渲染
2. 通过$store.commit 方法触发mutation 修改全局状态数据

### 稍微复杂

1. 组件里通过 $store.state获取全局状态数据进行渲染
2. 通过$store.dispath方法 触发action里的方法
3. action 触发mutation 修改全局状态数据

### 辅助函数

#### 值类型向计算属性映射

帮助我们减少代码量
mapState      将全局状态管理的state值映射到使用组件的计算属性
mapMutation   将全局状态管理的getters值映射到使用组件的计算属性

#### 函数类型向methods进行映射

mapGetters    将mutation的值映射到方法里
mapActions    将actions里的值映射到方法

### 模块化 

1. 模块化之后state的取值需要添加一级模块名 其他三个核心不变

### 减少网路请求

1. 数据本地化 （将数据存到本地存储）
   a.发起请求 查看本地有无数据
     b.本地有数据 读取本地 不需要网络请求
   本地无数据 发起网络请求 将数据存到本地
     问题1： 
   数据更新操作
   1. 给本地数据设置过期时间
      存入时同时存入过期时间
      取数据时和过期时间做对比
   2. 用户主动刷新数据 下拉刷新操作###下拉刷新和上拉加载
      通过better-scroll实现
      下拉刷新  下拉滚动层触及顶部重新请求波数据
      上拉加载  上拉滚动层触底请求下一页的数据 (分页)

### keep- alive只有在vue中可以用

缓存页面
在需要缓存的组件外部加上keepaLive
<keep-alive>
组件的切换路由
动态组件
</keep-alive>
内部的组件就会被缓存
actived激活触发
deactived失活触发

include='a,b'  名字叫a, b的组件会被缓存
exclude='a,b'  除了a和b其他的组件缓存

a需要在组件创建的时候通过name属性指定

### 动态路由动态导航

{
path: ' /singer/:id'
componet : Singer
}

直接修改动态导航时不会已引起组件的重新创建组件是复用的
组件内的守卫

beforeRouterEnter  进入组件之前
beforeRouterUpdate  当前组件路由发生修改
beforeRouterLeave  组件离开的时候触发

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
