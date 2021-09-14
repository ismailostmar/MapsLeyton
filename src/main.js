import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from "vue2-google-maps";
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.use(VueLodash, { name: 'custom', lodash: lodash })

Vue.use(VueGoogleMaps, {
    load: {
        libraries: ['geometry', 'places'],
        key: 'AIzaSyA-9Bl0O9wzWMwpWkKnl_JESUEX6ePiG7A',
    }
});

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')