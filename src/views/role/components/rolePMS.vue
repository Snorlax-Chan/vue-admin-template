<template>
  <div>
    <el-row>
      <el-col :span="17">
        <el-card class="box-card" shadow="never" style="height:80vh;">
          <div slot="header">
            <span>详情页</span>
          </div>
          <el-scrollbar style="height: 70vh;">
            <div style="font-size:20px;">
              <svg-icon icon-class="role" />
              {{ roleInfo.name }}
            </div>
            <div
              style="color: lightslategray;font-size: 15px; padding: 16px 5px 16px 16px;"
            >{{ roleInfo.description }}</div>
            <el-divider content-position="left">
              <svg-icon icon-class="page" style="margin-right: 10px;font-size:18px;" />页面权限
            </el-divider>
            <div style="padding: 5px 0 18px 0;">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckChangeAll"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group v-model="checkedRoute">
              <el-collapse v-model="selected.hasChild">
                <el-collapse-item v-for="item in selected" :key="item.name" :name="item.name">
                  <template slot="title">
                    <el-checkbox
                      :key="item.path"
                      :label="item.name"
                      :indeterminate="item.isIndeterminate"
                      @click.stop.native
                      @change="handleCheckChange($event,item)"
                    >&nbsp;</el-checkbox>
                    <span style="font-size:16px;">{{ item.title }}</span>
                    <el-tooltip
                      v-if="!item.children"
                      effect="dark"
                      content="设置按钮权限"
                      placement="bottom-start"
                    >
                      <el-button type="text" @click.stop="showButtomPMS(item.name)">
                        <span class="icon-type">
                          <svg-icon icon-class="setting-2" />
                        </span>
                      </el-button>
                    </el-tooltip>
                    <el-popover v-show="iseditDefaultRoutes" :ref="`popover-${item.name}-edit`" width="360" placement="right">
                      <div style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"><span>编辑角色</span></div>
                      <el-card shadow="never">
                        <el-form
                          ref="infoForm"
                          :rules="rules"
                          :model="ParentRoute"
                          label-width="80px"
                          validate-on-rule-change
                          status-icon
                        >
                          <el-form-item label="角色名" prop="name">
                            <el-input v-model="ParentRoute.meta.title" clearable />
                          </el-form-item>
                          <el-form-item label="角色描述" prop="description">
                            <el-input v-model="ParentRoute.meta.icon" type="textarea" clearable />
                          </el-form-item>
                        </el-form>
                        <div style="text-align: right; margin: 0">
                          <el-button
                            type="text"
                            size="mini"
                            @click="$refs[`popover-${item.name}-edit`][0].doClose();"
                          >取消</el-button>
                          <el-button
                            type="danger"
                            size="mini"
                            @click="$refs[`popover-${item.name}-edit`][0].doClose();"
                          >确定</el-button>
                        </div>
                      </el-card>
                      <span slot="reference" class="icon-default-type" @click.stop="">
                        <svg-icon icon-class="edit-2" />
                      </span>
                    </el-popover>
                    <el-popover v-show="iseditDefaultRoutes" :ref="`popover-${item.name}-dele`" width="160" placement="top">
                      <p>确定删除该项吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          type="text"
                          size="mini"
                          @click="$refs[`popover-${item.name}-dele`][0].doClose()"
                        >取消</el-button>
                        <el-button
                          type="danger"
                          size="mini"
                          @click.stop="$refs[`popover-${item.name}-dele`][0].doClose()"
                        >确定</el-button>
                      </div>
                      <span slot="reference" class="icon-default-type" @click.stop="">
                        <svg-icon icon-class="trash" />
                      </span>
                    </el-popover>
                  </template>
                  <span v-if="!item.children">
                    <svg-icon icon-class="notify" style="margin: 0 15px 0 26px;font-size:18px;" />此页面无二级页面！
                  </span>
                  <div v-else>
                    <el-checkbox-group v-model="item.checked">
                      <el-checkbox
                        v-for="itemchild in item.children"
                        :key="itemchild.path"
                        :label="itemchild.name"
                        @click.stop.native
                        @change="handleGroupCheckChange($event,item)"
                      >
                        {{ itemchild.title }}
                        <el-tooltip effect="dark" content="设置按钮权限" placement="bottom-start">
                          <el-button type="text" @click.stop="showButtomPMS(itemchild.name)">
                            <span class="icon-type">
                              <svg-icon icon-class="setting-2" />
                            </span>
                          </el-button>
                        </el-tooltip>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-checkbox-group>
          </el-scrollbar>
        </el-card>
      </el-col>
      <transition name="el-zoom-in-top">
        <el-col v-if="!isbuttomPMS" :span="7">
          <el-card shadow="never">
            <div slot="header">操作</div>
            <el-alert title="点击下方按钮保存！" type="info" show-icon :closable="false" />
            <el-button
              type="success"
              style="margin: 10px 0px 0px 0px;padding: 12px 80px 12px 80px;"
              :loading="isloading"
              @click="confirmRole"
            >提交</el-button>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-col v-if="isbuttomPMS" :span="7">
          <el-card shadow="never">
            <div style="font-size:20px;">
              <svg-icon icon-class="page" />
              {{ buttomPMS.title }}
              <span style="font-size: 5px;color: silver;margin-left: 5px;">页面名称</span>
            </div>
            <div
              style="color: lightslategray;font-size: 15px; padding: 16px 5px 16px 16px;"
            >此处管理已有按钮权限</div>
            <el-divider content-position="left">
              <svg-icon icon-class="setting-2" style="margin-right: 10px;font-size:18px;" />按钮权限
            </el-divider>
            <span v-if="(buttomPMS.realBPMS.length === 0)">
              <svg-icon
                icon-class="notify"
                style="margin: 0 10px 0 5px;font-size:18px;font-size:15px;"
              />此页面无已存在按钮！
            </span>
            <div v-else>
              <el-checkbox
                v-model="buttomPMS.checkAll"
                :indeterminate="isBtmIndeterminate"
                style="padding: 0 20px 5px 0;"
                @change="handleBtmCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group v-model="buttomPMS.hasBPMS" style="display:inline;">
                <el-checkbox
                  v-for="itbm in buttomPMS.realBPMS"
                  :key="itbm.id"
                  :label="itbm.name"
                  @change="handleBtmCheckedChange(itbm.name)"
                >{{ itbm.title }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <el-button
              v-if="(buttomPMS.realBPMS.length !== 0)"
              type="success"
              style="margin: 15px 0px 0px;padding: 2px 80px;font-size: 30px;"
              @click="confirmBtm"
            >
              <svg-icon icon-class="arrow-right-3" />
            </el-button>
            <el-button
              v-else
              type="success"
              style="margin: 15px 0px 0px;padding: 2px 80px;font-size: 30px;"
              @click="isbuttomPMS=false;"
            >
              <svg-icon icon-class="arrow-right-3" />
            </el-button>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-top">
        <el-col v-if="!isbuttomPMS" :span="7" style="margin-top:5px;">
          <el-card shadow="never">
            <el-alert title="点此新增页面和按钮！" type="info" show-icon :closable="false" />
            <el-button
              type="info"
              style="margin: 10px 0px 0px 0px;padding: 12px 52px 12px 52px;"
              :loading="isloading"
              @click="editDefaultRoutes"
            >管理通用模版</el-button>
          </el-card>
        </el-col>
      </transition>
    </el-row>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { updateRole, getRoutes, getdefaultRole } from '@/api/role'
import searchEvent from './SearchEvent'
const defaultParentRoute = {
  path: '',
  component: 'Layout',
  redirect: '',
  name: '',
  meta: {
    title: '',
    icon: ''
  },
  children: []
}
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
      isBtmIndeterminate: false,
      isbuttomPMS: false,
      isloading: false,
      iseditDefaultRoutes: false,
      defaultRole: {},
      roleInfo: [],
      buttomPMS: {},
      selected: [],
      checkedRoute: [],
      serviceRoutes: [],
      ParentRoute: Object.assign({}, defaultParentRoute),
      rules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '简介介绍角色职能', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    assign() {
      console.log('----assign---- ')
      this.roleInfo = deepClone(this.assign)
      this.iseditDefaultRoutes = false
      console.log(this.roleInfo)
    },
    roleInfo() {
      console.log('----roleInfo---- ')
      const routes = deepClone(this.roleInfo.routes)
      let data = []
      if (routes) {
        data = this.generateRoutes(routes)
      }
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
    this.getdefaultRole()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
    },
    getdefaultRole() {
      getdefaultRole().then(res => {
        this.defaultRole = res.data
      })
    },
    // cancel() {
    //   console.log('------------------')
    //   this.$nextTick(() => {
    //     console.log(this.$refs)
    //     this.$refs['popover-Dashboard-dele'][0].doClose()
    //   })
    // },
    confirmBtm() {
      this.roleInfo.routesCount = this.roleInfo.routesCount.filter(item => {
        return item.name !== this.buttomPMS.name
      })
      this.roleInfo.routesCount.push(this.buttomPMS)
      this.isbuttomPMS = false
    },
    editDefaultRoutes() {
      searchEvent.$emit('reCurrentRow')
      setTimeout(() => {
        this.iseditDefaultRoutes = true
        this.roleInfo = deepClone(this.defaultRole)
      }, 1000)
    },
    handleBtmCheckAllChange() {
      const list = []
      this.buttomPMS.realBPMS.forEach(item => {
        list.push(item.name)
      })
      this.buttomPMS.hasBPMS = this.buttomPMS.checkAll ? list : []
    },
    handleBtmCheckedChange(ischecked, name) {
      if (this.buttomPMS.hasBPMS.length === this.buttomPMS.realBPMS.length) {
        this.buttomPMS.checkAll = true
        this.isBtmIndeterminate = false
      } else if (this.buttomPMS.hasBPMS.length === 0) {
        this.isBtmIndeterminate = false
        this.buttomPMS.checkAll = false
      } else {
        this.isBtmIndeterminate = true
        this.buttomPMS.checkAll = false
      }
    },
    showButtomPMS(name) {
      this.isbuttomPMS = true
      // console.log(this.roleInfo, this.roleInfo.routesCount, name)
      const data = deepClone(this.roleInfo.routesCount)
      this.buttomPMS = data.filter(item => {
        return item.name === name
      })[0]
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
.box-card >>> .el-card__header {
  background-color: whitesmoke;
}
.icon-type {
  color: silver;
  font-size: 18px;
  margin-left: 5px;
}

.icon-type:hover {
  color: slategray;
  cursor: pointer;
}

.box-card-buttom >>> .el-card__header {
  background-color: #67c23a;
  color: white;
}

.icon-default-type{
  color: silver;
  margin-left: 5px;
  font-size: 15px;
  margin-top: 3px;
  display: inline-block;
}

.icon-default-type:hover{
  color: slategray;
  cursor: pointer;
}
</style>
