/* eslint-disable no-unused-vars */
import Mock from 'mockjs'

export const asyncRoutes = [
  {
    path: '/',
    component: 'Layout',
    redirect: '/dashboard',
    name: 'PrDashboard',
    meta: { title: '首页', icon: 'dashboard', affix: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: 'dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/permission',
    component: 'Layout',
    redirect: '/permission/role',
    name: 'Permission',
    meta: { title: '权限管理', icon: 'password' },
    children: [
      {
        path: 'person',
        name: 'Person',
        component: 'person',
        meta: { title: '人员管理', icon: 'person' }
      },
      {
        path: 'role',
        name: 'Role',
        component: 'role',
        meta: { title: '角色权限', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/form',
    component: 'Layout',
    name: 'PrForm',
    meta: { title: 'Form', icon: 'form' },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: 'form',
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/nested',
    component: 'Layout',
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: 'nested/menu1',
        name: 'Menu1',
        meta: { title: '菜单一' }
      },
      {
        path: 'menu2',
        component: 'nested/menu2',
        name: 'Menu2',
        meta: { title: '菜单二' }
      }
    ]
  },

  {
    path: 'external-link',
    component: 'Layout',
    name: 'PrExternal',
    meta: { title: ' External Link', icon: 'link' },
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        name: 'External',
        meta: { title: ' External Link', icon: 'link' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const test = [
  {
    path: '/',
    component: 'Layout',
    redirect: '/dashboard',
    name: 'PrDashboard',
    meta: { title: 'Dashboard', icon: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: 'dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

function refreshData() {
  const identify = Mock.mock({
    identify: /[a-zA-Z0-9]{4}/
  })
  return identify
}

function unArr(arr) {
  const res = {}
  arr = arr.reduce((item, next) => {
    res[next.path] ? '' : (res[next.path] = true && item.push(next))
    return item
  }, [])
  return arr
}

function getRoleName() {
  const res = []
  for (const i in roles) {
    res.push(roles[i].name)
  }
  return res
}

export const roles = [
  {
    id: '1',
    key: 'admin',
    name: '超级管理员',
    description: '我是一个超级管理员，拥有所有权限',
    routes: asyncRoutes
  },
  {
    id: '2',
    key: 'editor',
    name: '用户',
    description: '我是一个普通，只有特定权限',
    routes: test
  }
]

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['1'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    department: 'Super'
  },
  'editor-token': {
    roles: ['2'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    department: '人事部'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // user identify
  {
    url: '/user/identify',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: refreshData()
      }
    }
  },

  // user router
  {
    url: '/user/router',
    type: 'post',
    response: config => {
      const res = config.body
      let orignRuter = []
      if (res) {
        // eslint-disable-next-line no-unused-vars
        roles.forEach(item => {
          for (const i in res) {
            if (item.id === res[i]) orignRuter = orignRuter.concat(item.routes)
          }
        })
      } else {
        return {
          code: 12345,
          message: 'roles are incorrect.'
        }
      }

      const relRouter = unArr(orignRuter)
      if (!relRouter) {
        return {
          code: 123,
          message: 'router are incorrect.'
        }
      }
      return {
        code: 20000,
        data: relRouter
      }
    }
  },

  // user roles
  {
    url: '/user/roleName',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: getRoleName()
      }
    }
  },

  // user all
  {
    url: '/allUser',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: users
      }
    }
  }
]
