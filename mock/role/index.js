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
      name: 'Dashboard',
      title: '首页',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Person',
      title: '人员管理',
      checkAll: true,
      hasBPMS: ['NewOrgan', 'NewChildOrgan', 'EditOrgan', 'DeleOrgan', 'NewUser', 'ChangeDep', 'BatchLock', 'BatchUnLock', 'BatchDele', 'BatchUpdate', 'Export', 'LockUser', 'EditUser', 'DeleUsers'],
      realBPMS: [{
        name: 'NewOrgan',
        title: '新建组织',
        attach: ''
      },
      {
        name: 'NewChildOrgan',
        title: '新建子部门',
        attach: ''
      },
      {
        name: 'EditOrgan',
        title: '修改部门',
        attach: ''
      },
      {
        name: 'DeleOrgan',
        title: '删除部门',
        attach: ''
      },
      {
        name: 'NewUser',
        title: '新建用户',
        attach: ''
      },
      {
        name: 'ChangeDep',
        title: '调换部门',
        attach: ''
      },
      {
        name: 'BatchLock',
        title: '批量锁定',
        attach: ''
      },
      {
        name: 'BatchUnLock',
        title: '批量解锁',
        attach: ''
      },
      {
        name: 'BatchDele',
        title: '批量删除',
        attach: ''
      },
      {
        name: 'BatchUpdate',
        title: '批量上传',
        attach: ''
      },
      {
        name: 'Export',
        title: '导出',
        attach: ''
      },
      {
        name: 'LockUser',
        title: '锁定用户',
        attach: ''
      },
      {
        name: 'EditUser',
        title: '编辑用户',
        attach: ''
      },
      {
        name: 'DeleUsers',
        title: '删除用户',
        attach: ''
      }]
    },
    {
      name: 'Role',
      title: '角色权限',
      checkAll: true,
      hasBPMS: ['NewRole', 'EditRole', 'DeleRole', 'AdminPMS', 'NewPage', 'EditPage', 'SetButtom', 'DelePage', 'NewChildPage', 'NewButtom', 'EditButtom', 'DeleButtom', 'SubmitRoute', 'EditChildPage', 'DeleChildPage'],
      realBPMS: [{
        name: 'NewRole',
        title: '新建角色',
        attach: ''
      },
      {
        name: 'EditRole',
        title: '编辑角色',
        attach: ''
      },
      {
        name: 'DeleRole',
        title: '删除角色',
        attach: ''
      },
      {
        name: 'AdminPMS',
        title: '管理者模式',
        attach: ''
      },
      {
        name: 'NewPage',
        title: '新建页面',
        attach: ''
      },
      {
        name: 'EditPage',
        title: '修改页面',
        attach: ''
      },
      {
        name: 'SetButtom',
        title: '设置按钮',
        attach: ''
      },
      {
        name: 'DelePage',
        title: '删除页面',
        attach: ''
      },
      {
        name: 'NewChildPage',
        title: '新增子级页面',
        attach: ''
      },
      {
        name: 'EditChildPage',
        title: '编辑子级页面',
        attach: ''
      },
      {
        name: 'DeleChildPage',
        title: '删除子级页面',
        attach: ''
      },
      {
        name: 'NewButtom',
        title: '新建按钮',
        attach: ''
      },
      {
        name: 'EditButtom',
        title: '编辑按钮',
        attach: ''
      },
      {
        name: 'DeleButtom',
        title: '删除按钮',
        attach: ''
      },
      {
        name: 'SubmitRoute',
        title: '提交路由',
        attach: ''
      }
      ]
    },
    {
      name: 'Form',
      title: '表格',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Nested',
      title: '扩展',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Menu1',
      title: '菜单一',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Menu2',
      title: '菜单二',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'External',
      title: '外链',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Permission',
      title: '权限管理',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Nested',
      title: 'Nested',
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
      name: 'Dashboard',
      title: '首页',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Person',
      title: '人员管理',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Role',
      title: '角色权限',
      checkAll: false,
      hasBPMS: [],
      realBPMS: [{
        name: 'NewRole',
        title: '新建角色',
        attach: ''
      },
      {
        name: 'EditRole',
        title: '编辑角色',
        attach: ''
      },
      {
        name: 'DeleRole',
        title: '删除角色',
        attach: ''
      }
      ]
    },
    {
      name: 'Form',
      title: '表格',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Nested',
      title: '扩展',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Menu1',
      title: '菜单一',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Menu2',
      title: '菜单二',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'External',
      title: '外链',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    }
    ]
  },
  {
    id: '3',
    key: 'tester',
    name: '测试员',
    description: '我是一个测试员，拥有所有页面权限，但没有任何按钮权限',
    routes: asyncRoutes,
    routesCount: [{
      name: 'Dashboard',
      title: '首页',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Person',
      title: '人员管理',
      checkAll: true,
      hasBPMS: [],
      realBPMS: [{
        name: 'NewOrgan',
        title: '新建组织',
        attach: ''
      },
      {
        name: 'NewChildOrgan',
        title: '新建子部门',
        attach: ''
      },
      {
        name: 'EditOrgan',
        title: '修改部门',
        attach: ''
      },
      {
        name: 'DeleOrgan',
        title: '删除部门',
        attach: ''
      },
      {
        name: 'NewUser',
        title: '新建用户',
        attach: ''
      },
      {
        name: 'ChangeDep',
        title: '调换部门',
        attach: ''
      },
      {
        name: 'BatchLock',
        title: '批量锁定',
        attach: ''
      },
      {
        name: 'BatchUnLock',
        title: '批量解锁',
        attach: ''
      },
      {
        name: 'BatchDele',
        title: '批量删除',
        attach: ''
      },
      {
        name: 'BatchUpdate',
        title: '批量上传',
        attach: ''
      },
      {
        name: 'Export',
        title: '导出',
        attach: ''
      },
      {
        name: 'LockUser',
        title: '锁定用户',
        attach: ''
      },
      {
        name: 'EditUser',
        title: '编辑用户',
        attach: ''
      },
      {
        name: 'DeleUsers',
        title: '删除用户',
        attach: ''
      }]
    },
    {
      name: 'Role',
      title: '角色权限',
      checkAll: true,
      hasBPMS: ['SubmitRoute', 'SetButtom'],
      realBPMS: [{
        name: 'NewRole',
        title: '新建角色',
        attach: ''
      },
      {
        name: 'EditRole',
        title: '编辑角色',
        attach: ''
      },
      {
        name: 'DeleRole',
        title: '删除角色',
        attach: ''
      },
      {
        name: 'AdminPMS',
        title: '管理者模式',
        attach: ''
      },
      {
        name: 'NewPage',
        title: '新建页面',
        attach: ''
      },
      {
        name: 'EditPage',
        title: '修改页面',
        attach: ''
      },
      {
        name: 'SetButtom',
        title: '设置按钮',
        attach: ''
      },
      {
        name: 'DelePage',
        title: '删除页面',
        attach: ''
      },
      {
        name: 'NewChildPage',
        title: '新增子级页面',
        attach: ''
      },
      {
        name: 'EditChildPage',
        title: '编辑子级页面',
        attach: ''
      },
      {
        name: 'DeleChildPage',
        title: '删除子级页面',
        attach: ''
      },
      {
        name: 'NewButtom',
        title: '新建按钮',
        attach: ''
      },
      {
        name: 'EditButtom',
        title: '编辑按钮',
        attach: ''
      },
      {
        name: 'DeleButtom',
        title: '删除按钮',
        attach: ''
      },
      {
        name: 'SubmitRoute',
        title: '提交路由',
        attach: ''
      }
      ]
    },
    {
      name: 'Form',
      title: '表格',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Nested',
      title: '扩展',
      checkAll: true,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Menu1',
      title: '菜单一',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Menu2',
      title: '菜单二',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'External',
      title: '外链',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Permission',
      title: '权限管理',
      checkAll: false,
      hasBPMS: [],
      realBPMS: []
    },
    {
      name: 'Nested',
      title: 'Nested',
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
    name: 'Dashboard',
    title: '首页',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    name: 'Person',
    title: '人员管理',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    name: 'Role',
    title: '角色权限',
    checkAll: false,
    hasBPMS: [],
    realBPMS: [{
      name: 'NewRole',
      title: '新建角色',
      attach: ''
    },
    {
      name: 'EditRole',
      title: '编辑角色',
      attach: ''
    },
    {
      name: 'DeleRole',
      title: '删除角色',
      attach: ''
    }
    ]
  },
  {
    name: 'Form',
    title: '表格',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    name: 'Nested',
    title: '扩展',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    name: 'Menu1',
    title: '菜单一',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    name: 'Menu2',
    title: '菜单二',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  },
  {
    name: 'External',
    title: '外链',
    checkAll: false,
    hasBPMS: [],
    realBPMS: []
  }
  ]
}

const totalBPMS = [
  {
    name: 'Dashboard',
    title: '首页',
    realBPMS: []
  },
  {
    name: 'Person',
    title: '人员管理',
    realBPMS: [{
      name: 'NewOrgan',
      title: '新建组织',
      attach: ''
    },
    {
      name: 'NewChildOrgan',
      title: '新建子部门',
      attach: ''
    },
    {
      name: 'EditOrgan',
      title: '修改部门',
      attach: ''
    },
    {
      name: 'DeleOrgan',
      title: '删除部门',
      attach: ''
    },
    {
      name: 'NewUser',
      title: '新建用户',
      attach: ''
    },
    {
      name: 'ChangeDep',
      title: '调换部门',
      attach: ''
    },
    {
      name: 'BatchLock',
      title: '批量锁定',
      attach: ''
    },
    {
      name: 'BatchUnLock',
      title: '批量解锁',
      attach: ''
    },
    {
      name: 'BatchDele',
      title: '批量删除',
      attach: ''
    },
    {
      name: 'BatchUpdate',
      title: '批量上传',
      attach: ''
    },
    {
      name: 'Export',
      title: '导出',
      attach: ''
    },
    {
      name: 'LockUser',
      title: '锁定用户',
      attach: ''
    },
    {
      name: 'EditUser',
      title: '编辑用户',
      attach: ''
    },
    {
      name: 'DeleUsers',
      title: '删除用户',
      attach: ''
    }]
  },
  {
    name: 'Role',
    title: '角色权限',
    realBPMS: [{
      name: 'NewRole',
      title: '新建角色',
      attach: ''
    },
    {
      name: 'EditRole',
      title: '编辑角色',
      attach: ''
    },
    {
      name: 'DeleRole',
      title: '删除角色',
      attach: ''
    },
    {
      name: 'AdminPMS',
      title: '管理者模式',
      attach: ''
    },
    {
      name: 'NewPage',
      title: '新建页面',
      attach: ''
    },
    {
      name: 'EditPage',
      title: '修改页面',
      attach: ''
    },
    {
      name: 'SetButtom',
      title: '设置按钮',
      attach: ''
    },
    {
      name: 'DelePage',
      title: '删除页面',
      attach: ''
    },
    {
      name: 'NewChildPage',
      title: '新增子级页面',
      attach: ''
    },
    {
      name: 'EditChildPage',
      title: '编辑子级页面',
      attach: ''
    },
    {
      name: 'DeleChildPage',
      title: '删除子级页面',
      attach: ''
    },
    {
      name: 'NewButtom',
      title: '新建按钮',
      attach: ''
    },
    {
      name: 'EditButtom',
      title: '编辑按钮',
      attach: ''
    },
    {
      name: 'DeleButtom',
      title: '删除按钮',
      attach: ''
    },
    {
      name: 'SubmitRoute',
      title: '提交路由',
      attach: ''
    }
    ]
  },
  {
    name: 'Form',
    title: '表格',
    realBPMS: []
  },
  {
    name: 'Nested',
    title: '扩展',
    realBPMS: []
  },
  {
    name: 'Menu1',
    title: '菜单一',
    realBPMS: []
  },
  {
    name: 'Menu2',
    title: '菜单二',
    realBPMS: []
  },
  {
    name: 'External',
    title: '外链',
    realBPMS: []
  },
  {
    name: 'Permission',
    title: '权限管理',
    realBPMS: []
  },
  {
    name: 'Nested',
    title: 'Nested',
    realBPMS: []
  },
  {
    name: 'PrDashboard',
    title: '首页',
    realBPMS: []
  },
  {
    name: 'PrForm',
    title: '表格',
    realBPMS: []
  },
  {
    name: 'PrExternal',
    title: '外链',
    realBPMS: []
  }
]
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

  // get total RoutesCount
  {
    url: '/BPMS/TotalBPMS',
    type: 'get',
    response: {
      code: 20000,
      data: totalBPMS
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

  // update child routes
  {
    url: '/update/updateChildRoutes',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // update btm
  {
    url: '/update/updateBtm',
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
        data: Mock.Random.character('lower')
      }
    }
  },

  // add new btm
  {
    url: '/add/addBtm',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: Mock.Random.character('lower')
      }
    }
  },

  // dele route
  {
    url: '/dele/deleRoutes',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // dele child route
  {
    url: '/dele/deleChildRoutes',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // dele child route
  {
    url: '/dele/deleBtm',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
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
