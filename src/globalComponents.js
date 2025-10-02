import AppHeader from './components/GlobalComponent/AppHeader.vue';
import HomePageFrom from './components/360Degree/HomePageFrom.vue';
import ModalButton from './components/Modal/ModalButton.vue';
import Background from './components/GlobalComponent/Background.vue';


const GlobalComponents = {
  install(Vue) {
    Vue.component('AppHeader', AppHeader);
    Vue.component('HomePageFrom', HomePageFrom);
    Vue.component('ModalButton',ModalButton);
    Vue.component('Background',Background);
  },
};

export default GlobalComponents;