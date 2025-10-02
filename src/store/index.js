import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
    };
  },
  mutations: {
    setAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
  },
  actions: {
    login({ commit }) {
      commit('setAuthenticated', true);
    },
    logout({ commit }) {
      commit('setAuthenticated', false);
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
  },
});

export default store;