import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//import store from './store';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/main.scss";
import GlobalComponents from "./globalComponents";
import blind from "./directives/blind";
import navigationPlugin from "./plugin/navigationPlugin";
import * as bootstrap from "bootstrap";
import i18n from "./plugin/i18n";
import 'vue3-flag-icons/styles';
const app = createApp(App);
app.use(i18n);
// Use plugins
app.use(router);
app.use(navigationPlugin, router);
//app.use(store);

// Use global components
app.use(GlobalComponents);

// Use directive
app.directive("blind", blind);

// Make Bootstrap available globally
window.bootstrap = bootstrap;

// if (sessionStorage.getItem('colors') != null) {
//   const colors = JSON.parse(sessionStorage.getItem('colors'));
//   document.documentElement.style.setProperty('--primary-color', colors.primaryColor);
//   document.documentElement.style.setProperty('--secondary-color', colors.secondaryColor);
//   document.documentElement.style.setProperty('--tertiary-color', colors.tertiaryColor);
//   document.documentElement.style.setProperty('--quaternary-color', colors.quaternaryColor);
//   document.documentElement.style.setProperty('--quinary-color', colors.quinaryColor);
//   document.documentElement.style.setProperty('--senary-color', colors.senaryColor);
//   document.documentElement.style.setProperty('--septenary-color', colors.septenaryColor);
//   document.documentElement.style.setProperty('--octonary-color', colors.octonaryColor);
//   document.documentElement.style.setProperty('--nonary-color', colors.nonary);
//   document.documentElement.style.setProperty('--denary-color', colors.denaryColor);
//   document.documentElement.style.setProperty('--font-primary-color', colors.fontColorPrimary);
//   document.documentElement.style.setProperty('--font-secondary-color', colors.fontColorSecondary);
// }

// Mount the app
app.mount("#app");
