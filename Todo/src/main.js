import Vue from 'vue'
import App from './components/App/App.vue';
import router from './router'
import './plugins/bootstrap'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
