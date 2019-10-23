<template>
  <div class="app-container">
    <el-button v-if="ifAddRole" type="primary" @click="handleAddRole">新建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="100" type="index" :index="1" />
      <el-table-column align="center" label="角色名" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述" width="500" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="ifEditRole" type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button v-if="ifDeleRole" type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名">
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
          <vxe-table
            ref="treetable"
            resizable
            :row-class-name="getRowClass"
            :data="routesData"
            row-id="name"
            :select-config="{checkRowKeys: checkedRoute}"
            @select-change="selectChangeEvent"
            @select-all="selectAllEvent"
          >
            <vxe-table-column type="selection" title="全选" width="80" tree-node />
            <vxe-table-column field="title" title="列表" tree-node />
            <vxe-table-column type="expand" width="60">
              <template v-slot="{ row, rowIndex }">
                <el-checkbox-group
                  v-model="row.checked"
                  @change="handleCheckedChange(rowIndex,row)"
                >
                  <el-checkbox
                    v-for="item in row.children"
                    :key="item.path"
                    :label="item.name"
                  >{{ item.title }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </vxe-table-column>
          </vxe-table>
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
import store from '@/store'
import path from 'path'
import { deepClone } from '@/utils'
import {
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole,
  getRoleEditPMS
} from '@/api/role'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  name: 'RolePermission',
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
      checkedRoute: [],
      RoleEditPMS: [],
      ifAddRole: false,
      ifEditRole: false,
      ifDeleRole: false
    }
  },
  computed: {
    routesData() {
      return this.selected
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
    this.getRoleEditPMS()
    this.setButtonPMS()
  },
  methods: {
    setButtonPMS() {
      if (this.RoleEditPMS) {
        // eslint-disable-next-line no-unused-vars
        for (const i of this.RoleEditPMS) {
          if (i === 'NewRole') this.ifAddRole = true
          if (i === 'EditRole') this.ifEditRole = true
          if (i === 'DeleRole') this.ifDeleRole = true
        }
      } else {
        console.log('该页面按钮权限不存在，请检查错误')
      }
    },
    getRoleEditPMS() {
      const routeName = this.$route.name
      const rolesPMS = store.getters.rolesPMS
      // eslint-disable-next-line no-unused-vars
      for (const i of rolesPMS) {
        if (i.name === routeName) {
          this.RoleEditPMS = i.hasBPMS
        }
      }
    },
    /*
    以下是树形表格对应的方法
    树形表格基于vxe-table组件和elementUI的checkbox组件，以下方法对应参数可以查询
    vuex-table:https://xuliangzhan_admin.gitee.io/vxe-table/#/table/api
    elementUI：https://element.eleme.cn/#/zh-CN/component/checkbox
    getRowClass({ row, index }):设置表格每行的样式，用于隐藏扩展行图标
    selectAllEvent({ selection, checked }):设置表格自带checkbox全选事件
    handleCheckAllChange(val):elementUI的checkbox全选事件
    handleCheckedChange(value, row):elementui的checkbox切换（change）事件
    selectChangeEvent({ rowIndex, checked }):设置表格自带checkbox切换（change）事件
    */
    selectAllEvent({ selection, checked }) {
      if (checked) {
        const res = []
        // eslint-disable-next-line no-unused-vars
        for (const item in selection) {
          if (selection[item].children) {
            this.selected[item].checkAll = checked
            this.handleCheckAllChange(item)
          }
          res.push(selection[item].name)
        }
        this.checkedRoute = res
      } else {
        this.checkedRoute = []
        // eslint-disable-next-line no-unused-vars
        for (const item in this.selected) {
          if (this.selected[item].children) {
            this.selected[item].checkAll = checked
            this.handleCheckAllChange(item)
          }
        }
      }
    },
    handleCheckAllChange(val) {
      const route = []
      this.selected[val].children.filter(item => {
        route.push(item.name)
      })
      this.selected[val].checked = this.selected[val].checkAll ? route : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value, row) {
      this.$nextTick(() => {
        const route = []
        this.selected[value].children.filter(item => {
          route.push(item.name)
        })
        const checkedCount = this.selected[value].checked.length
        this.selected[value].checkAll = checkedCount === route.length
        if (!this.selected[value].checkAll) {
          this.checkedRoute = this.checkedRoute.filter(item => {
            if (item !== this.selected[value].name) {
              return item
            }
          })
          this.$refs.treetable.setSelection(row, false)
        } else {
          this.checkedRoute.push(this.selected[value].name)
          this.$refs.treetable.setSelection(row, true)
        }
        this.isIndeterminate = checkedCount > 0 && checkedCount < route.length
      })
    },
    getRowClass({ row, index }) {
      const res = []
      if (!row.children) { // 即该行没有子元素时，添加row-expand-cover类
        res.push('row-expand-cover')
      }
      return res
    },
    selectChangeEvent({ rowIndex, checked }) {
      if (this.selected[rowIndex].children) {
        this.selected[rowIndex].checkAll = checked
        this.handleCheckAllChange(rowIndex)
        if (checked) {
          this.checkedRoute.push(this.selected[rowIndex].name)
        } else {
          this.checkedRoute = this.checkedRoute.filter(item => {
            if (item !== this.selected[rowIndex].name) {
              return item
            }
          })
        }
      } else {
        if (checked) {
          this.checkedRoute.push(this.selected[rowIndex].name)
        } else {
          this.checkedRoute = this.checkedRoute.filter(item => {
            if (item !== this.selected[rowIndex].name) {
              return item
            }
          })
        }
      }
    },
    /*
      以下方法是数据处理方法
      getchecked(routes, selected)：将选择checked的数据和原路由对比，生成表格展示数据。
      若要实现路由无限层级必须重写该方法，同时该方法涉及到js函数传参引用类型对象的修改（即传入的参数
      必须深复制后传入，否则会造成对原数据的污染）
      getcheckedArr(routes)：检查树形表格中checkbox选中项
      若要实现路由无限层级必须重写该方法
    */
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
                res.push(item.name)
              })
              route.checked = res
            } else {
              checkedRoute.push(i.name)
            }
          }
        }
      })
      this.checkedRoute = checkedRoute
      return routes
    },
    getcheckedArr(routes) {
      let res = []
      // eslint-disable-next-line no-unused-vars
      for (const route of routes) {
        if (route.checked) {
          res = res.concat(route.checked)
        }
        // 若要修改为无限路由可能需要此步
        if (route.children) {
          res = res.concat(this.getcheckedArr(route.children))
        }
      }

      return res
    },
    // 以下为ajax取值方法
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
      this.realRoutes = this.generateRoutes(res.data)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    async getRolePMS() {
      const res = await getRoleEditPMS()
      this.RoleEditPMS = res.data
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
      this.$nextTick(() => {
        this.role = Object.assign({}, defaultRole)
        this.selected = []
        this.checkedRoute = []
        // 此处必须用deepclone
        // 原因js传参（若参数为引用类型时，即数组对象等，会复制一份该引用的地址）
        // 所以在修改参数传入的引用类型对象时，若对该对象进行修改，因为该对象在内存中的地址相同，修改会同步
        this.selected = deepClone(this.routes)
        if (this.$refs.treetable) {
          this.$refs.treetable.reloadData(this.routes)
        }
        this.dialogType = 'new'
        this.dialogVisible = true
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.selected = []
      this.checkedRoute = []
      this.$nextTick(() => {
        this.role = deepClone(scope.row)
        const routes = this.generateRoutes(this.role.routes)
        console.log(routes)
        const realRoutes = deepClone(this.routes)
        // this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        this.selected = this.getchecked(realRoutes, this.generateArr(routes))
        this.$refs.treetable.reloadData(this.selected)
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
    generateTree(routes, checkedKeys) {
      const res = []

      // eslint-disable-next-line no-unused-vars
      for (const route of routes) {
        const routeName = route.name

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            checkedKeys
          )
        }

        if (
          checkedKeys.includes(routeName) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      const checkedNames = this.checkedRoute.concat(this.getcheckedArr(this.selected))
      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), checkedNames)
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
<style>
.row-expand-cover .vxe-table--expanded {
  visibility: hidden;
}
</style>
