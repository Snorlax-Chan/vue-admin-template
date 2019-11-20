import Mock from 'mockjs'
import { roles, asyncRoutes, test } from '../user'

// 角色对应路由的按钮权限
const roleEditPMS = [
  {
    id: '1',
    key: 'admin',
    name: '超级管理员',
    description: '我是一个超级管理员，拥有所有权限',
    routes: asyncRoutes,
    routesCount: [{
      id: '1',
      name: 'Dashboard',
      title: '首页',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '2',
      name: 'Person',
      title: '人员管理',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '3',
      name: 'Role',
      title: '角色权限',
      checkAll: true,
      hasBPMS: ['NewRole', 'EditRole', 'DeleRole'],
      realBPMS: [{
        id: '2-1',
        name: 'NewRole',
        title: '新建角色'
      },
      {
        id: '2-2',
        name: 'EditRole',
        title: '编辑角色'
      },
      {
        id: '2-3',
        name: 'DeleRole',
        title: '删除角色'
      }
      ]
    },
    {
      id: '4',
      name: 'Form',
      title: '表格',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '5',
      name: 'Nested',
      title: '扩展',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '6',
      name: 'Menu1',
      title: '菜单一',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '7',
      name: 'Menu2',
      title: '菜单二',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '8',
      name: 'External',
      title: '外链',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    }
    ]
  },
  {
    id: '2',
    key: 'editor',
    name: '用户',
    description: '我是一个普通角色，只有特定权限',
    routes: test,
    routesCount: [{
      id: '1',
      name: 'Dashboard',
      title: '首页',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '2',
      name: 'Person',
      title: '人员管理',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '3',
      name: 'Role',
      title: '角色权限',
      checkAll: false,
      hasBPMS: [],
      realBPMS: [{
        id: '2-1',
        name: 'NewRole',
        title: '新建角色'
      },
      {
        id: '2-2',
        name: 'EditRole',
        title: '编辑角色'
      },
      {
        id: '2-3',
        name: 'DeleRole',
        title: '删除角色'
      }
      ]
    },
    {
      id: '4',
      name: 'Form',
      title: '表格',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '5',
      name: 'Nested',
      title: '扩展',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '6',
      name: 'Menu1',
      title: '菜单一',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '7',
      name: 'Menu2',
      title: '菜单二',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      id: '8',
      name: 'External',
      title: '外链',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    }
    ]
  }
]

const defaultRole = {
  id: '2352',
  key: 'test',
  name: '默认角色',
  description: '这是一个默认角色',
  routes: [],
  routesCount: [{
    id: '1',
    name: 'Dashboard',
    title: '首页',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    id: '2',
    name: 'Person',
    title: '人员管理',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    id: '3',
    name: 'Role',
    title: '角色权限',
    checkAll: false,
    hasBPMS: [],
    realBPMS: [{
      id: '2-1',
      name: 'NewRole',
      title: '新建角色'
    },
    {
      id: '2-2',
      name: 'EditRole',
      title: '编辑角色'
    },
    {
      id: '2-3',
      name: 'DeleRole',
      title: '删除角色'
    }
    ]
  },
  {
    id: '4',
    name: 'Form',
    title: '表格',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    id: '5',
    name: 'Nested',
    title: '扩展',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    id: '6',
    name: 'Menu1',
    title: '菜单一',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    id: '7',
    name: 'Menu2',
    title: '菜单二',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    id: '8',
    name: 'External',
    title: '外链',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  }
  ]
}
export default [
  // mock get all routes form server
  {
    url: '/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: asyncRoutes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roles
      }
    }
  },

  // add role
  {
    url: '/role',
    type: 'post',
    response: config => {
      let routesCount = {}
      if (config.body.routesCount.length === 0) {
        routesCount = defaultRole.routesCount
      }
      return {
        code: 20000,
        data: {
          id: Mock.mock('@integer(300, 5000)'),
          key: Mock.Random.character('lower'),
          routesCount: routesCount
        }
      }
    }
  },

  // update role
  {
    url: '/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete role
  {
    url: '/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // get default Role
  {
    url: '/role/defaultRole',
    type: 'get',
    response: {
      code: 20000,
      data: defaultRole
    }
  },

  // update routes
  {
    url: '/update/updateRoutes',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // add routes
  // 新增默认的路由，应返回一个不重复的name
  {
    url: '/add/addRoutes',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: Mock.Random.character('lower')
      }
    }
  },

  // add child routes
  {
    url: '/add/addChildRoutes',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success1'
      }
    }
  },

  // user roleAllEditPMS
  {
    url: '/roleAllEditPMS',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roleEditPMS
      }
    }
  },

  // user roleEditPMS
  {
    url: '/EditRolePMS',
    type: 'post',
    response: config => {
      const res = config.body
      let resRoleEditPMS = []
      if (res) {
        roleEditPMS.forEach(item => {
          // eslint-disable-next-line no-unused-vars
          for (const i in res) {
            if (item.id === res[i]) resRoleEditPMS = resRoleEditPMS.concat(item.routesCount)
          }
        })
      } else {
        return {
          code: 12345,
          message: 'roles are incorrect.'
        }
      }
      if (!resRoleEditPMS) {
        return {
          code: 123,
          message: 'resRoleEditPMS are incorrect.'
        }
      }
      return {
        code: 20000,
        data: resRoleEditPMS
      }
    }
  }
]
