// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'; //  http://fontawesome.io
import axios from 'axios'

axios.defaults.withCredentials = true;

// axios.defaults.baseURL = '/api/';

Vue.use(ElementUI);
Vue.prototype.$axios = axios
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.path == '/gucrm/login') {
    sessionStorage.removeItem('loginInfo');
  }

  let user = JSON.parse(sessionStorage.getItem('loginInfo'));
  if (!user && to.path != '/gucrm/login') {
    next({ path: '/gucrm/login' });
  } else {
    next();
  };
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
