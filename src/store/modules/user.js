import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    routers: []
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
    SET_ROUTERS: (state, routers) => {
        state.routers = routers
    }
}

const actions = {
    // user login
    login ({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { data } = response
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    //修改为获取routers信息
    getInfo ({ commit, state }) {
        // console.log('进入了Action（getinfo）')
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                // console.log('即将根据去取用户信息' + state.token)
                const { data } = response
                // console.log('取到了用户信息' + data)
                if (!data) {
                    reject('Verification failed, please Login again.')
                }

                const { routers, name, avatar } = data
                // console.log('这是取到的路由信息' + routers)
                // roles must be a non-empty array
                if (!routers || routers.length <= 0) {
                    reject('getInfo: router must be a non-null array!')
                }
                // console.log('开始往state中存储用户信息')
                commit('SET_ROUTERS', routers)
                // console.log('这里成功了吗')
                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                // console.log('看看state中的routers' + state.routers)
                resolve(routers)
                // console.log('结束了，看看routers的值' + routers)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout ({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROUTERS', [])
                removeToken()
                resetRouter()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken ({ commit }) {
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

