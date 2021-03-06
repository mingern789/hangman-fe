export const state = () => ({
  user: {
    loggedIn: false,
    data: null,
    playerId: null
  },
});

export const mutations = {
  SET_LOGGED_IN(state, value) {
    state.user.loggedIn = value;
  },
  SET_USER(state, data) {
    state.user.data = data;
  },
  SET_ID(state, data) {
    state.user.playerId = data;
  },
};

export const getters = {
  user(state) {
    return state.user;
  },
};

export const actions = {
  fetchUser({ commit }, user) {
    commit("SET_LOGGED_IN", user !== null);
    if (user) {
      commit("SET_USER", {
        displayName: user.displayName,
        email: user.email,
      });
    } else {
      commit("SET_USER", null);
    }
  },
};
