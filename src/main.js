// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入图标库
import './assets/css/font/iconfont.css'
// 引入css文件
import './assets/css/index.css'
import './assets/css/common.css'

// 引入vue-baidu-map百度地图组件
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap,{
  ak:'TZ5FVdg7pP0UGhEb2gDd6HGubdDn48cq'
})

// axios 接口配置 ／ static/bus.js
// import axios from 'axios';
// // 全局配置axios请求相对路径
// const baseUrl = process.env.NODE_ENV === "development" ?  '/api/management' : '/bcm-mrg/management'
// axios.defaults.baseURL=baseUrl;

// 导航守卫
router.beforeEach((to, from, next) => {
  // to and from are both route objects
  // 判断是否需要登录
  if(to.matched.some(record => record.meta.requiresAuth)){
    let loginStatus=JSON.parse(sessionStorage.getItem('loginStatus'))
    // 判断是否登录
    if(!loginStatus){
      next({
        name:'login',
        query:{
          redirect: to.fullPath
        }
      })
    }else{
      next()
    }
  }else{
    sessionStorage.setItem('loginStatus',false)
    next();
  }
})



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
