// polyfill
import 'babel-polyfill'
// Vue
import Vue from 'vue'
import App from './App'
// store
import store from '@/store/index'
// 多国语
import i18n from './i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// d2crud
import D2Crud from '@d2-projects/d2-crud'
// 菜单和路由设置
import router from './router'
import { frameInRoutes } from '@/router/routes'
// 全局filter
import * as filters from './filters'
import VueUeditorWrap from 'vue-ueditor-wrap'
// 核心插件
Vue.use(d2Admin)
// D2表单操作
Vue.use(D2Crud)
//
Vue.component('VueUeditorWrap', VueUeditorWrap)

// 全局filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 刷新页面时,从持久化数据加载数据到vuex
    this.$store.commit('d2admin/account/load')
    // 设置侧边栏菜单
    this.$store.commit('d2admin/menu/asideSet')
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet')
    // 多页面控制: 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
  },
  mounted () {
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.commit('d2admin/fullscreen/listen')
  }
}).$mount('#app')
