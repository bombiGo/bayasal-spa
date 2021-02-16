export const state = () => ({
  infoCategories: []
});

export const getters = {
  authenticated(state) {
    return state.auth.loggedIn;
  },

  user(state) {
    return state.auth.user;
  },

  infoCategories(state) {
    return state.infoCategories;
  }
};

export const mutations = {
  setInfoCategories(state, data) {
    state.infoCategories = data;
  }
};