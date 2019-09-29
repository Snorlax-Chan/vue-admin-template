import { constantRoutes } from '@/router'

import Layout from '@/layout' // Layout 是架构组件，不在后台返回，在文件里单独引入
import store from '..'

const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission (roles, route) {
//     if (route.meta && route.meta.roles) {
//         return roles.some(role => route.meta.roles.includes(role))
//     } else {
//         return true
//     }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// 原先根据角色判断路由的方法，已弃用
// export function filterAsyncRoutes (routes, roles) {
//     const res = []

//     routes.forEach(route => {
//         const tmp = { ...route }
//         if (hasPermission(roles, tmp)) {
//             if (tmp.children) {
//                 tmp.children = filterAsyncRoutes(tmp.children, roles)
//             }
//             res.push(tmp)
//         }
//     })

//     return res
// }
// 替代上面的获取路由方法，改为直接从后台遍历得到routers，将其修改为router正确格式
function filterAsyncRouter(asyncRouterMap) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouter = asyncRouterMap.filter(route => {
    // console.log('开始修改compoent' + route.component)
    if (route.component) {
      if (route.component === 'Layout') {
        // Layout组件特殊处理
        route.component = Layout
        // console.log('设置layout成功' + route.component)
      } else {
        route.component = _import(route.component)
        // console.log('设置其他component成功' + route.component)
      }
    }
    if (route.children && route.children.length) {
      // console.log('检测到子路由，开始子路由迭代')
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouter
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, router) {
    return new Promise(resolve => {
      let accessedRoutes
      if (router) {
        accessedRoutes = filterAsyncRouter(router)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
