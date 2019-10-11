<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="100" type="index" :index="1" />
      <el-table-column align="center" label="角色名" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述" width="220" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="姓名">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="组件列表">

          <tree-table :routes="selected" :checked-route="checkedRoute" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import {
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole
} from '@/api/role'
import TreeTable from './treeTable'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  name: 'RolePermission',
  components: {
    TreeTable
  },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      selected: [],
      checkedRoute: []
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    getchecked(routes, selected) {
      const checkedRoute = []
      routes.forEach(route => {
        // eslint-disable-next-line no-unused-vars
        for (const i of selected) {
          if (route.path === i.path) {
            if (i.children) {
              if (i.children.length === route.children.length) {
                checkedRoute.push(i.name)
                route.checkAll = true
                route.isIndeterminate = false
              } else {
                route.checkAll = false
                route.isIndeterminate = true
              }
              const res = []
              i.children.forEach(item => {
                res.push(item.title)
              })
              console.log(res)
              route.checked = res
            } else {
              checkedRoute.push(i.name)
            }
          }
        }
      })
      console.log(checkedRoute)
      this.checkedRoute = checkedRoute
      return routes
    },
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      // eslint-disable-next-line no-unused-vars
      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          name: route.name
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        console.log('原数据' + routes)
        // this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        this.selected = this.getchecked(routes, this.generateArr(routes))
        console.log('处理后' + this.selected)
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      // eslint-disable-next-line no-unused-vars
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          )
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      if (isEdit) {
        await updateRole(this.role.key, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.key = data.key
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
