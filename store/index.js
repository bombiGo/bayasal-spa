export const state = () => ({
  infoCategories: [],
  recipeCategories: []
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
  },

  recipeCategories(state) {
    return state.recipeCategories;
  }
};

export const mutations = {
  setInfoCategories(state, data) {
    state.infoCategories = data;
  },
  setRecipeCategories(state, data) {
    state.recipeCategories = data;
  }
};