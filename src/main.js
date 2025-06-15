import { createApp } from 'vue';
import App from './App.vue';
import routes from './router/index.js';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
// import {
//   FormGroupPlugin,
//   FormInputPlugin,
//   FormPlugin,
//   ButtonPlugin,
//   ToastPlugin,
//   CardPlugin,
//   NavbarPlugin,
//   FormSelectPlugin,
//   AlertPlugin,
//   LayoutPlugin,
// } from 'bootstrap-vue';
// [
//   FormGroupPlugin,
//   FormInputPlugin,
//   FormPlugin,
//   ButtonPlugin,
//   ToastPlugin,
//   CardPlugin,
//   NavbarPlugin,
//   FormSelectPlugin,
//   AlertPlugin,
//   LayoutPlugin,
// ].forEach((plugin) => {
//   createApp(App).use(plugin);
// });

import store from './store.js';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);

app.config.globalProperties.store = store;

app.config.globalProperties.toast = function (title, content, variant = null, append = false) {
  const toastContainerId = "toast-container";
  let toastContainer = document.getElementById(toastContainerId);
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = toastContainerId;
    toastContainer.style.position = "fixed";
    toastContainer.style.top = "1rem";
    toastContainer.style.right = "1rem";
    toastContainer.style.zIndex = "1055";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${variant || 'info'} border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${title}</strong><br>${content}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  if (!append) {
    toastContainer.innerHTML = "";
  }
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};
window.store = store;
window.axios = axios;
window.toast = app.config.globalProperties.toast;
window.router = router;

app.mount('#app');
