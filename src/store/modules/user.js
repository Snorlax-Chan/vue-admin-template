import { login, logout, getInfo, getRouter } from '@/api/user'
import { getRoleEditPMS } from '@/api/role'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import router from '@/router'
import store from '@/store'
import { deepClone } from '@/utils'
import { assRoute, assAttribute } from '@/utils/route'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  route: [],
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
  SET_ROUTE: (state, route) => {
    state.route = route
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
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(async(response) => {
          const { token, data } = response
          commit('SET_TOKEN', token)
          // commit('SET_ROLES', roles)
          commit('SET_NAME', data.f_pu_name)
          commit('SET_AVATAR', data.f_pu_avatar)
          const list = deepClone(data.routeList)
          const routeList = assRoute(list)
          // console.log(data.attributeList)
          const attList = deepClone(data.attributeList)
          const attributeList = assAttribute(list, attList)
          commit('SET_ROUTE', routeList)
          commit('SET_ROLESPMS', attributeList)
          // const route = deepClone(data.route)
          setToken(token)
          const accessRoutes = await store.dispatch('permission/generateRoutes', routeList)
          router.addRoutes(accessRoutes)
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
      getInfo().then(async response => {
        const { token, data } = response
        commit('SET_TOKEN', token)
        // commit('SET_ROLES', roles)
        commit('SET_NAME', data.f_pu_name)
        commit('SET_AVATAR', data.f_pu_avatar)
        const list = deepClone(data.routeList)
        const routeList = assRoute(list)
        const attList = deepClone(data.attributeList)
        const attributeList = assAttribute(list, attList)
        commit('SET_ROUTE', routeList)
        commit('SET_ROLESPMS', attributeList)
        // const route = deepClone(data.route)
        setToken(token)
        await store.dispatch('permission/generateRoutes', routeList)
        // router.addRoutes(accessRoutes)
        resolve()
      }).catch(error => {
        router.push({ path: this.redirect || '/' })
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
      logout()
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROUTE', [])
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
