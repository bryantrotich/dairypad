

import { createApp, h } from 'vue'
import { createPinia } from 'pinia'

import api from './api'
import router from './router'
import i18n from "./translation";
import toast from "./toast";

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from './assets/icons'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { RouterView } from 'vue-router';

import './assets/scss/app.scss';

const app = createApp(() => h(RouterView))

app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.use(toast);
// app.component('EasyDataTable', Vue3EasyDataTable);
app.use(createPinia())
app.use(router)
app.use(api);
app.use(i18n);
app.use(VueSweetalert2);

app.mount('#app')
