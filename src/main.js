import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'
import Vuelidate from 'vuelidate'

import { router } from './routes'
import { store } from './store'

Vue.use(Vuelidate);

axios.defaults.baseURL = 'http://localhost:3000';
//axios.defaults.headers.common['Accepts'] = 'application/json';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
