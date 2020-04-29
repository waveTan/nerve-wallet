import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VePie from 'v-charts/lib/pie.common'
import i18n from './i18n'
import {post} from './api/https'
import {toThousands} from "./api/util";

Vue.config.devtools = process.env.NODE_ENV === 'development'

Vue.config.productionTip = false;
Vue.filter('toThousands', toThousands)
//定义全局变量
Vue.prototype.$post = post;
Vue.component(VePie.name, VePie);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');

