import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";
import api from "@/api/index";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      api.user
        .login({ userName: username.trim(), password: password })
        .then(res => {
          if (res.status) {
            commit("SET_TOKEN", res.data.token);
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            resolve(res);
          } else {
            resolve(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.user.getInfo()
        .then(res => {
          if(!res.status) {
            reject(res.msg);
            return;
          }
          const { data } = res;

          const { roles, userName, icon } = data;

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject("暂无权限");
          }

          commit("SET_ROLES", roles);
          commit("SET_NAME", userName);
          commit("SET_AVATAR", icon);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();
          localStorage.removeItem("token")
          resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + "-token";

    commit("SET_TOKEN", token);
    setToken(token);

    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
