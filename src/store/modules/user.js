import { login, logout, getInfo, getRouter } from '@/api/user'
import { getRoleEditPMS } from '@/api/role'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  router: [],
  rolesPMS: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTERS: (state, router) => {
    state.router = router
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLESPMS: (state, rolesPMS) => {
    state.rolesPMS = rolesPMS
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { name, avatar } = data
          const roles = [...data.roles]
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(roles)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user router
  getRouter({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getRouter(roles).then(response => {
        const router = response.data
        if (!router || router.length <= 0) {
          reject('getRouter: router must be a non-null array!')
        }

        commit('SET_ROUTERS', router)
        resolve(router)
      })
    })
  },

  // get user rolesPMS
  getRolesPMS({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getRoleEditPMS(roles).then(response => {
        const roleEditPMS = response.data
        if (!roleEditPMS || roleEditPMS.length <= 0) {
          reject('getRoleEditPMS: roleEditPMS must be a non-null array!')
        }
        commit('SET_ROLESPMS', roleEditPMS)
        resolve()
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROUTERS', [])
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROUTERS', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
