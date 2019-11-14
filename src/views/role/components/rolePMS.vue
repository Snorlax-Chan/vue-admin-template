<template>
  <div>
    <el-row>
      <el-col :span="17">
        <el-card class="box-card" shadow="never" style="height:80vh;">
          <div slot="header">
            <span>详情页</span>
          </div>
          <el-scrollbar style="height: 70vh;">
            <div style="font-size:20px;"><svg-icon icon-class="role" style="margin-right: 10px;font-size:25px;" />{{ roleInfo.name }}</div>
            <div style="color: lightslategray;font-size: 15px; padding: 16px 5px 16px 16px;">
              {{ roleInfo.description }}
            </div>
            <el-divider content-position="left"><svg-icon icon-class="page" style="margin-right: 10px;font-size:18px;" />页面权限</el-divider>
            <div style="padding: 5px 0 18px 0;">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckChangeAll"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group v-model="checkedRoute">
              <el-collapse v-model="selected.hasChild">
                <el-collapse-item v-for="item in selected" :key="item.key" :name="item.name">
                  <template slot="title">
                    <el-checkbox
                      :key="item.path"
                      :label="item.name"
                      :indeterminate="item.isIndeterminate"
                      @click.stop.native
                      @change="handleCheckChange($event,item)"
                    >&nbsp;</el-checkbox>
                    <span style="font-size:16px;">{{ item.title }}</span>
                  </template>
                  <span v-if="!item.children"><svg-icon icon-class="notify" style="margin: 0 15px 0 26px;font-size:18px;" />此页面无二级页面！</span>
                  <div v-else>
                    <el-checkbox-group v-model="item.checked">
                      <el-checkbox
                        v-for="itemchild in item.children"
                        :key="itemchild.path"
                        :label="itemchild.name"
                        @click.stop.native
                        @change="handleGroupCheckChange($event,item)"
                      >{{ itemchild.title }}  <el-button type="text"><span><svg-icon icon-class="buttom" /></span></el-button></el-checkbox>

                    </el-checkbox-group>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-checkbox-group>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card shadow="never">
          <div slot="header">操作</div>
          <el-alert
            title="点击下方按钮保存！"
            type="info"
            show-icon
            :closable="false"
          />
          <el-button type="success" style="margin: 10px 0px 0px 0px;padding: 12px 80px 12px 80px;" :loading="isloading" @click="confirmRole">提交</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { updateRole, getRoutes } from '@/api/role'
export default {
  props: {
    assign: {
      type: Object,
      required: true,
      default: function() {
        return {}
      } }
  },
  data() {
    return {
      activeNames: ['1'],
      checkAll: false,
      isIndeterminate: false,
      isloading: false,
      roleInfo: [],
      selected: [],
      checkedRoute: [],
      serviceRoutes: []
    }
  },
  watch: {
    assign() {
      this.roleInfo = deepClone(this.assign)
    },
    roleInfo() {
      const routes = deepClone(this.roleInfo.routes)
      const data = this.generateRoutes(routes)
      const realRoutes = this.generateRoutes(deepClone(this.serviceRoutes))
      this.selected = this.getchecked(realRoutes, data)
    },
    checkedRoute() {
      if (this.checkedRoute.length === this.selected.length) {
        this.isIndeterminate = false
        this.checkAll = true
      } else if (this.checkedRoute.length === 0) {
        this.isIndeterminate = false
        this.checkAll = false
      } else {
        this.isIndeterminate = true
        this.checkAll = false
      }
    }
  },
  created() {
    this.getRoutes()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
    },
    confirmRole() {
      this.isloading = true
      const checkedNames = this.checkedRoute.concat(this.getcheckedArr(this.selected))
      this.roleInfo.routes = this.generateTree(deepClone(this.serviceRoutes), checkedNames)
      updateRole(this.roleInfo.id, this.roleInfo).then(res => {
        if (res.data.status === 'success') {
          this.isloading = false
          this.$message({
            showClose: true,
            message: '角色信息修改成功！',
            type: 'success'
          })
        }
      }).catch(e => {
        this.$message({
          showClose: true,
          message: '角色信息修改失败！错误信息：' + e,
          type: 'error'
        })
      })
    },
    handleCheckChange(ischecked, route) {
      route.isIndeterminate = false
      if (route.children) {
        const data = []
        route.children.forEach(item => {
          data.push(item.name)
        })
        route.checked = ischecked ? data : []
      }
    },
    handleGroupCheckChange(ischecked, route) {
      if (route.checked.length === route.children.length) {
        this.checkedRoute.push(route.name)
        route.isIndeterminate = false
      } else if (route.checked.length === 0) {
        this.checkedRoute = this.checkedRoute.filter(item => {
          return item !== route.name
        })
        route.isIndeterminate = false
      } else {
        this.checkedRoute = this.checkedRoute.filter(item => {
          return item !== route.name
        })
        route.isIndeterminate = true
      }
    },
    handleCheckChangeAll(ischecked) {
      const data = []
      this.selected.forEach(item => {
        data.push(item.name)
      })
      this.checkedRoute = ischecked ? data : []
      this.selected.forEach(item => {
        this.handleCheckChange(ischecked, item)
      })
    },
    getchecked(routes, selected = []) {
      const checkedRoute = []
      const data = deepClone(routes)
      const hasChild = []
      data.forEach(route => {
        route.checked = []
        // eslint-disable-next-line no-unused-vars
        for (const i of selected) {
          if (route.path === i.path) {
            if (i.children) {
              hasChild.push(i.name)
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
                route.children.forEach(j => {
                  if (item.name === j.name) {
                    res.push(item.name)
                  }
                })
              })
              route.checked = deepClone(res)
              // return
            } else {
              checkedRoute.push(i.name)
              route.checked = []
            }
          }
        }
      })
      if (checkedRoute.length === 0) {
        this.isIndeterminate = false
        this.checkAll = false
      } else if (checkedRoute.length === data.length) {
        this.isIndeterminate = false
        this.checkAll = true
      } else {
        this.isIndeterminate = true
        this.checkAll = false
      }
      this.checkedRoute = checkedRoute
      data.hasChild = hasChild
      return data
    },
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

<style  scoped>
.box-card >>> .el-card__header{
  background-color: whitesmoke;
}
</style>
