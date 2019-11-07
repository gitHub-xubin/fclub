import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './api/ajax'
import base from './utils/common.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.use(ElementUI);
Vue.use(base)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
