<template>
  <div>
    <el-row>
      <el-col :span="15">
        <el-card class="box-card" shadow="never" style="height:80vh;">
          <div slot="header">
            <span v-if="!iseditDefaultRoutes">详情页</span>
            <span v-else>默认角色及页面按钮等修改</span>
            <span v-if="isShowBtm('AdminPMS')" style="float:right">
              <span>管理者模式</span>
              <el-switch
                v-model="iseditDefaultRoutes"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="editDefaultRoutes"
              />
            </span>
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
              <el-popover
                v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('NewPage')"
                :ref="`popover-routes-add`"
                width="360"
                placement="top"
              >
                <div
                  style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"
                >
                  <span>新增页面</span>
                </div>
                <el-card shadow="never">
                  <el-form
                    ref="addRouteForm"
                    :rules="rules"
                    :model="ParentRoute"
                    label-width="80px"
                    validate-on-rule-change
                    status-icon
                    label-position="right"
                  >
                    <el-form-item label="页面路径" prop="path">
                      <el-input v-model="ParentRoute.path" clearable />
                    </el-form-item>
                    <el-form-item label="重定向" prop="redirect">
                      <el-input v-model="ParentRoute.redirect" clearable />
                    </el-form-item>
                    <el-form-item label="页面标题" prop="meta.title">
                      <el-input v-model="ParentRoute.meta.title" clearable />
                    </el-form-item>
                    <el-form-item label="页面图标" prop="meta.icon">
                      <el-input v-model="ParentRoute.meta.icon" clearable />
                    </el-form-item>
                    <el-form-item label="是否隐藏" prop="hidden">
                      <el-switch
                        v-model="ParentRoute.hidden"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                      />
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="text"
                      size="mini"
                      @click="$refs[`popover-routes-add`].doClose();"
                    >取消</el-button>
                    <el-button type="danger" size="mini" @click="addRoutes()">确定</el-button>
                  </div>
                </el-card>
                <span slot="reference" class="icon-default-type" title="新增页面" @click.stop="editRoute(false,'')">
                  <svg-icon
                    icon-class="add-a-subscription"
                    class="add-icon-type"
                    style="margin: -10px 0 0px 230px;font-size: 36px;"
                  />
                </span>
              </el-popover>
            </el-divider>
            <div style="padding: 5px 0 18px 0;">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckChangeAll"
              >全选</el-checkbox>
            </div>
            <el-checkbox-group v-model="checkedRoute">
              <el-collapse v-model="selected.hasChild" @change="isbuttomPMS = false">
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
                    <el-tooltip v-if="isShowBtm('SetButtom')" effect="dark" content="设置按钮权限" placement="bottom-start">
                      <el-button type="text" @click.stop="showButtomPMS(item.name)">
                        <span class="icon-type">
                          <svg-icon icon-class="setting-2" />
                        </span>
                      </el-button>
                    </el-tooltip>
                    <el-popover
                      v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('EditPage')"
                      :ref="`popover-${item.name}-edit`"
                      width="360"
                      placement="right"
                    >
                      <div
                        style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"
                      >
                        <span>编辑页面</span>
                      </div>
                      <el-card shadow="never">
                        <el-form
                          :ref="`editRoute-${item.name}-form`"
                          :rules="rules"
                          :model="ParentRoute"
                          label-width="80px"
                          validate-on-rule-change
                          status-icon
                          label-position="right"
                        >
                          <el-form-item label="页面路径" prop="path">
                            <el-input v-model="ParentRoute.path" clearable />
                          </el-form-item>
                          <el-form-item label="重定向" prop="redirect">
                            <el-input v-model="ParentRoute.redirect" clearable />
                          </el-form-item>
                          <el-form-item label="页面标题" prop="meta.title">
                            <el-input v-model="ParentRoute.meta.title" clearable />
                          </el-form-item>
                          <el-form-item label="页面图标">
                            <el-input v-model="ParentRoute.meta.icon" clearable />
                          </el-form-item>
                          <el-form-item label="是否隐藏" prop="hidden">
                            <el-switch
                              v-model="ParentRoute.hidden"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                            />
                          </el-form-item>
                        </el-form>
                        <div style="text-align: right; margin: 0">
                          <el-button
                            type="text"
                            size="mini"
                            @click="$refs[`popover-${item.name}-edit`][0].doClose();"
                          >取消</el-button>
                          <el-button type="danger" size="mini" @click="updateRoutes(item);">确定</el-button>
                        </div>
                      </el-card>
                      <span
                        slot="reference"
                        class="icon-default-type"
                        @click.stop="editRoute(true,item)"
                      >
                        <svg-icon icon-class="edit-2" />
                      </span>
                    </el-popover>
                    <el-popover
                      v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('DelePage')"
                      :ref="`popover-${item.name}-dele`"
                      width="160"
                      placement="top"
                    >
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
                          @click.stop="$refs[`popover-${item.name}-dele`][0].doClose();deleRoute(item);"
                        >确定</el-button>
                      </div>
                      <span slot="reference" class="icon-default-type" @click.stop>
                        <svg-icon icon-class="trash" />
                      </span>
                    </el-popover>
                    <el-popover
                      v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('NewChildPage')"
                      :ref="`popover-${item.name}-add`"
                      width="360"
                      placement="right"
                    >
                      <div
                        style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"
                      >
                        <span>新增子级页面</span>
                      </div>
                      <el-card shadow="never">
                        <el-form
                          :ref="`addChildRoute-${item.name}-Form`"
                          :rules="rules"
                          :model="ChildrenRoute"
                          label-width="80px"
                          validate-on-rule-change
                          status-icon
                          label-position="right"
                        >
                          <el-form-item label="页面路径" prop="path">
                            <el-input v-model="ChildrenRoute.path" clearable />
                          </el-form-item>
                          <el-form-item label="组件" prop="component">
                            <el-input v-model="ChildrenRoute.component" clearable />
                          </el-form-item>
                          <el-form-item label="页面标题" prop="meta.title">
                            <el-input v-model="ChildrenRoute.meta.title" clearable />
                          </el-form-item>
                          <el-form-item label="页面图标" prop="meta.icon">
                            <el-input v-model="ChildrenRoute.meta.icon" clearable />
                          </el-form-item>
                        </el-form>
                        <div style="text-align: right; margin: 0">
                          <el-button
                            type="text"
                            size="mini"
                            @click="$refs[`popover-${item.name}-add`][0].doClose();"
                          >取消</el-button>
                          <el-button type="danger" size="mini" @click="addChildRoutes(item)">确定</el-button>
                        </div>
                      </el-card>
                      <span
                        slot="reference"
                        class="icon-default-type"
                        @click.stop="editChildRoute(false,item,[])"
                      >
                        <svg-icon icon-class="add" />
                      </span>
                    </el-popover>
                  </template>
                  <span v-if="!item.children">
                    <svg-icon icon-class="notify" style="margin: 0 15px 0 26px;font-size:18px;" />此页面无二级页面！
                  </span>
                  <div v-else>
                    <el-checkbox-group v-model="item.checked">
                      <el-checkbox
                        v-for="(itemchild,index) in item.children"
                        :key="itemchild.path"
                        :label="itemchild.name"
                        @click.stop.native
                        @change="handleGroupCheckChange($event,item)"
                      >
                        {{ itemchild.title }}
                        <el-tooltip v-if="isShowBtm('SetButtom')" effect="dark" content="设置按钮权限" placement="bottom-start">
                          <el-button type="text" @click.stop="showButtomPMS(itemchild.name)">
                            <span class="icon-type">
                              <svg-icon icon-class="setting-2" />
                            </span>
                          </el-button>
                        </el-tooltip>
                        <el-button type="text" style="margin-left: -5px;">
                          <el-popover
                            v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('EditChildPage')"
                            :ref="`popover-${item.name}-editchild`"
                            width="360"
                            placement="right"
                          >
                            <div
                              style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"
                            >
                              <span>编辑子级页面</span>
                            </div>
                            <el-card shadow="never">
                              <el-form
                                :ref="`editChildRoute-${item.name}-Form`"
                                :rules="rules"
                                :model="ChildrenRoute"
                                label-width="80px"
                                validate-on-rule-change
                                status-icon
                                label-position="right"
                              >
                                <el-form-item label="页面路径" prop="path">
                                  <el-input v-model="ChildrenRoute.path" clearable />
                                </el-form-item>
                                <el-form-item label="组件" prop="component">
                                  <el-input v-model="ChildrenRoute.component" clearable />
                                </el-form-item>
                                <el-form-item label="页面标题" prop="meta.title">
                                  <el-input v-model="ChildrenRoute.meta.title" clearable />
                                </el-form-item>
                                <el-form-item label="页面图标" prop="meta.icon">
                                  <el-input v-model="ChildrenRoute.meta.icon" clearable />
                                </el-form-item>
                              </el-form>
                              <div style="text-align: right; margin: 0">
                                <el-button
                                  type="text"
                                  size="mini"
                                  @click="$refs[`popover-${item.name}-editchild`][index].doClose();"
                                >取消</el-button>
                                <el-button
                                  type="danger"
                                  size="mini"
                                  @click="updateChildRoutes(item,itemchild,index)"
                                >确定</el-button>
                              </div>
                            </el-card>
                            <span
                              slot="reference"
                              class="icon-default-type"
                              @click.stop="editChildRoute(true,item,itemchild)"
                            >
                              <svg-icon icon-class="edit-2" />
                            </span>
                          </el-popover>
                        </el-button>
                        <el-button type="text" style="margin-left:-5px;">
                          <el-popover
                            v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('DeleChildPage')"
                            :ref="`popover-${item.name}-deleChild`"
                            width="160"
                            placement="top"
                          >
                            <p>确定删除该项吗？</p>
                            <div style="text-align: right; margin: 0">
                              <el-button
                                type="text"
                                size="mini"
                                @click="$refs[`popover-${item.name}-deleChild`][index].doClose()"
                              >取消</el-button>
                              <el-button
                                type="danger"
                                size="mini"
                                @click.stop="$refs[`popover-${item.name}-deleChild`][index].doClose();deleChildRoute(item,itemchild);"
                              >确定</el-button>
                            </div>
                            <span slot="reference" class="icon-default-type" @click.stop>
                              <svg-icon icon-class="trash" />
                            </span>
                          </el-popover>
                        </el-button>
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
        <el-col :span="9" style="margin-top:5px;">
          <el-card shadow="never">
            <div slot="header">操作</div>
            <el-alert title="点击下方按钮保存！" type="info" show-icon :closable="false" />
            <el-button
              v-if="isShowBtm('SubmitRoute')"
              type="success"
              style="margin: 10px 0px 0px 30px;padding: 12px 80px 12px 80px;"
              :loading="isloading"
              @click="confirmRole"
            >提交</el-button>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-col v-if="isbuttomPMS" :span="9">
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
              <el-popover
                v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('NewButtom')"
                :ref="`popover-route-newBtm`"
                width="360"
                placement="right"
              >
                <div
                  style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"
                >
                  <span>新建按钮</span>
                </div>
                <el-card shadow="never">
                  <el-form
                    ref="route-newBtm-form"
                    :rules="rules"
                    :model="btmInfo"
                    label-width="80px"
                    validate-on-rule-change
                    status-icon
                    label-position="right"
                  >
                    <el-form-item label="按钮名" prop="title">
                      <el-input v-model="btmInfo.title" clearable />
                    </el-form-item>
                    <el-form-item label="附加">
                      <el-input v-model="btmInfo.attach" clearable type="textarea" />
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="text"
                      size="mini"
                      @click="$refs[`popover-route-newBtm`].doClose();"
                    >取消</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="addBtm()"
                    >确定</el-button>
                  </div>
                </el-card>
                <span slot="reference" title="新增按钮" @click.stop="editBtm(false,'')">
                  <svg-icon
                    v-if="iseditDefaultRoutes"
                    icon-class="add-a-subscription"
                    class="add-icon-type"
                  />
                </span>
              </el-popover>
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
                  v-for="(itbm,index) in buttomPMS.realBPMS"
                  :key="itbm.id"
                  :label="itbm.name"
                  style="margin-right:30px;"
                  @change="handleBtmCheckedChange(itbm.name)"
                >
                  {{ itbm.title }}
                  <el-button type="text" style="margin-left: -5px;">
                    <el-popover
                      v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('EditButtom')"
                      :ref="`popover-${itbm.name}-editBtm`"
                      width="360"
                      placement="right"
                    >
                      <div
                        style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"
                      >
                        <span>编辑按钮</span>
                      </div>
                      <el-card shadow="never">
                        <el-form
                          :ref="`form-${itbm.name}-editBtm`"
                          :rules="rules"
                          :model="btmInfo"
                          label-width="260px"
                          validate-on-rule-change
                          status-icon
                          label-position="top"
                        >
                          <el-form-item label="按钮名" prop="title">
                            <el-input v-model="btmInfo.title" clearable />
                          </el-form-item>
                          <el-form-item label="附加">
                            <el-input v-model="btmInfo.attach" clearable />
                          </el-form-item>
                        </el-form>
                        <div style="text-align: right; margin: 0">
                          <el-button
                            type="text"
                            size="mini"
                            @click="$refs[`popover-${itbm.name}-editBtm`][index].doClose();"
                          >取消</el-button>
                          <el-button
                            type="danger"
                            size="mini"
                            @click="updateBtm(itbm,index);"
                          >确定</el-button>
                        </div>
                      </el-card>
                      <span slot="reference" class="icon-default-type" @click.stop="editBtm(true,itbm)">
                        <svg-icon icon-class="edit-2" />
                      </span>
                    </el-popover>
                  </el-button>
                  <el-button type="text" style="margin-left:-5px;">
                    <el-popover
                      v-if="iseditDefaultRoutes&&isShowBtm('AdminPMS')&&isShowBtm('DeleButtom')"
                      :ref="`popover-${itbm.name}-deleBtm`"
                      width="160"
                      placement="top"
                    >
                      <p>确定删除该项吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          type="text"
                          size="mini"
                          @click="$refs[`popover-${itbm.name}-deleBtm`][0].doClose()"
                        >取消</el-button>
                        <el-button
                          type="danger"
                          size="mini"
                          @click.stop="$refs[`popover-${itbm.name}-deleBtm`][0].doClose();deleBtm(itbm);"
                        >确定</el-button>
                      </div>
                      <span slot="reference" class="icon-default-type" @click.stop>
                        <svg-icon icon-class="trash" />
                      </span>
                    </el-popover>
                  </el-button>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </el-col>
      </transition>
    </el-row>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { updateRole, getRoutes, getdefaultRole, updateRoutes, addRoutes,
  addChildRoutes, deleRoutes, updateChildRoutes, deleChildRoutes, getTotalBPMS, addBtm, updateBtm, deleBtm } from '@/api/role'
import searchEvent from './SearchEvent'
const defaultParentRoute = {
  path: '',
  component: 'Layout',
  redirect: '',
  hidden: false,
  name: '',
  meta: Object.assign({}, defaultMata)
}
const defaultMata = {
  title: '',
  icon: ''
}

const defaultChildrenRoute = {
  path: '',
  name: '',
  component: '',
  meta: Object.assign({}, defaultMata)
}

const defaultBtmInfo = {
  name: '',
  title: '',
  attach: ''
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
    const validatePath = (rule, value, callback) => {
      if (!(/(^\/?[a-z]+)*/).test(value)) {
        callback(new Error('路径地址格式错误，参照/path'))
      } else {
        callback()
      }
    }
    return {
      activeNames: ['1'],
      checkAll: false,
      isIndeterminate: false,
      isBtmIndeterminate: false,
      isbuttomPMS: false,
      isloading: false,
      iseditDefaultRoutes: false,
      RoleEditPMS: [],
      RoleEditPMSInfo: [],
      defaultRole: {},
      totalBPMS: {},
      roleInfo: [],
      buttomPMS: {},
      selected: [],
      checkedRoute: [],
      serviceRoutes: [],
      realRoutes: [],
      ChildrenRoute: Object.assign({}, defaultChildrenRoute),
      ParentRoute: Object.assign({}, defaultParentRoute),
      btmInfo: Object.assign({}, defaultBtmInfo),
      rules: {
        path: [
          { required: true, message: '请输入路径', trigger: 'blur' },
          { validator: validatePath, trigger: 'blur' }
        ],
        redirect: [
          { required: false, message: '请输入路径', trigger: 'blur' },
          { validator: validatePath, trigger: 'blur' }
        ],
        'meta.title': [
          { required: true, message: '请输入页面标题', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入正确的组件名', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入正确的按钮名', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'rolesPMS'
    ])
  },
  watch: {
    assign() {
      this.roleInfo = deepClone(this.assign)
      this.iseditDefaultRoutes = false
      this.isbuttomPMS = false
    },
    roleInfo() {
      const routes = deepClone(this.roleInfo.routes)
      let data = []
      if (routes) {
        data = this.generateRoutes(routes)
      }
      this.realRoutes = deepClone(this.serviceRoutes)
      this.selected = this.getchecked(this.generateRoutes(this.realRoutes), data)
    },
    realRoutes() {
      if (this.iseditDefaultRoutes) {
        this.selected = this.getchecked(this.generateRoutes(this.realRoutes), [])
      }
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
    this.getRoleEditPMS()
    this.getRoutes()
    this.getdefaultRole()
    this.getTotalBPMS()
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
    getTotalBPMS() {
      getTotalBPMS().then(res => {
        this.totalBPMS = res.data
      })
    },
    getRoleEditPMS() {
      const routeName = this.$route.name
      const rolesPMS = this.rolesPMS
      // eslint-disable-next-line no-unused-vars
      for (const i of rolesPMS) {
        if (i.name === routeName) {
          this.RoleEditPMS = i.hasBPMS
          this.RoleEditPMSInfo = i.realBPMS
        }
      }
    },
    isShowBtm(name) {
      if (this.RoleEditPMS.indexOf(name) > -1) {
        return true
      } else {
        return false
      }
    },
    addChildRoutes(item) {
      this.$refs[`addChildRoute-${item.name}-Form`][0].validate(valid => {
        if (valid) {
          addChildRoutes(this.ChildrenRoute).then(res => {
            if (res.data) {
              this.$message({
                showClose: true,
                message: '子级页面信息新增成功！',
                type: 'success'
              })
              this.ChildrenRoute.name = res.data
              if (!item.children) {
                this.realRoutes.forEach(jtem => {
                  if (jtem.children) {
                    jtem.children.forEach(btem => {
                      if (btem.name === item.name) {
                        jtem.children.push(this.ChildrenRoute)
                      }
                    })
                  }
                })
              } else {
                this.realRoutes.forEach(jtem => {
                  if (jtem.name === item.name) {
                    jtem.children.push(this.ChildrenRoute)
                  }
                })
              }
              this.selected = this.getchecked(this.generateRoutes(this.realRoutes), [])
              this.$refs[`popover-${item.name}-add`][0].doClose()
            }
          }).catch(e => {
            this.$message({
              showClose: true,
              message: '新增失败！错误信息：' + e,
              type: 'error'
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '新增失败！请正确填写表单',
            type: 'error'
          })
        }
      })
    },
    addRoutes() {
      this.$refs.addRouteForm.validate(valid => {
        if (valid) {
          addRoutes(this.ParentRoute).then(res => {
            if (res.data) {
              this.ParentRoute.name = res.data
              this.$message({
                showClose: true,
                message: '页面信息新增成功！',
                type: 'success'
              })
              this.realRoutes.push(this.ParentRoute)
              this.$refs[`popover-routes-add`].doClose()
            }
          }).catch(e => {
            this.$message({
              showClose: true,
              message: '修改失败！错误信息：' + e,
              type: 'error'
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '提交失败，请正确填写表单',
            type: 'error'
          })
        }
      })
    },
    addBtm() {
      this.$refs['route-newBtm-form'].validate(valid => {
        if (valid) {
          addBtm(this.buttomPMS.name, this.btmInfo).then(res => {
            if (res.data) {
              this.btmInfo.name = res.data
              this.$message({
                showClose: true,
                message: '按钮新增成功！',
                type: 'success'
              })
              this.totalBPMS.forEach(item => {
                if (item.name === this.buttomPMS.name) {
                  item.realBPMS.push(this.btmInfo)
                }
              })
              this.showButtomPMS(this.buttomPMS.name)
              this.$refs[`popover-route-newBtm`].doClose()
            }
          }).catch(e => {
            this.$message({
              showClose: true,
              message: '新增失败！错误信息：' + e,
              type: 'error'
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '提交失败，请正确填写表单',
            type: 'error'
          })
        }
      })
    },
    updateRoutes(item) {
      this.$refs[`editRoute-${item.name}-form`][0].validate(valid => {
        if (valid) {
          updateRoutes(this.ParentRoute).then(res => {
            if (res.data === 'success') {
              this.$message({
                showClose: true,
                message: '页面信息修改成功！',
                type: 'success'
              })
              // eslint-disable-next-line no-unused-vars
              for (const i in this.realRoutes) {
                if (this.realRoutes[i].name === this.ParentRoute.name) {
                  if (this.realRoutes[i].children.length < 2) {
                    this.realRoutes[i].children[0].meta.title = this.ParentRoute.meta.title
                    this.realRoutes[i].children[0].meta.icon = this.ParentRoute.meta.icon
                  } else {
                    this.realRoutes[i] = deepClone(this.ParentRoute)
                  }
                }
              }
              this.selected = this.getchecked(this.generateRoutes(this.realRoutes), [])
              // this.realRoutes.forEach(jtem => {
              //   if (jtem.name === this.ParentRoute.name) {
              //     jtem = deepClone(this.ParentRoute)
              //   }
              // })
              this.$refs[`popover-${item.name}-edit`][0].doClose()
            }
          }).catch(e => {
            this.$message({
              showClose: true,
              message: '修改失败！错误信息：' + e,
              type: 'error'
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '修改失败！请正确填写表单',
            type: 'error'
          })
        }
      })
    },
    updateChildRoutes(item, itemchild, index) {
      this.$refs[`editChildRoute-${item.name}-Form`][0].validate(valid => {
        if (valid) {
          updateChildRoutes(item.name, this.ChildrenRoute).then(res => {
            if (res.data === 'success') {
              this.$message({
                showClose: true,
                message: '子页面信息修改成功！',
                type: 'success'
              })
              this.realRoutes.forEach(jtem => {
                if (jtem.name === item.name) {
                  if (jtem.children) {
                    // eslint-disable-next-line no-unused-vars
                    for (const i in jtem.children) {
                      if (jtem.children[i].name === itemchild.name) {
                        jtem.children[i] = deepClone(this.ChildrenRoute)
                      }
                    }
                  }
                }
              })
              this.selected = this.getchecked(this.generateRoutes(this.realRoutes), [])
              this.$refs[`popover-${item.name}-editchild`][index].doClose()
            }
          }).catch(e => {
            this.$message({
              showClose: true,
              message: '修改失败！错误信息：' + e,
              type: 'error'
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '修改失败！请正确填写表单',
            type: 'error'
          })
        }
      })
    },
    updateBtm(itbm, index) {
      this.$refs[`form-${itbm.name}-editBtm`][0].validate(valid => {
        if (valid) {
          updateBtm(this.buttomPMS.name, this.btmInfo).then(res => {
            if (res.data === 'success') {
              this.$message({
                showClose: true,
                message: '按钮信息修改成功！',
                type: 'success'
              })
              this.totalBPMS.forEach(item => {
                if (item.name === this.buttomPMS.name) {
                  item.realBPMS.forEach(jtem => {
                    if (jtem.name === this.btmInfo.name) {
                      jtem.title = this.btmInfo.title
                      jtem.attch = this.btmInfo.attach
                    }
                  })
                  // for (const i in item.realBPMS) {
                  //   if (item.realBPMS[i].name === this.btmInfo.name) {
                  //     item.realBPMS[i] = deepClone(this.btmInfo)
                  //   }
                  // }
                }
              })
              this.showButtomPMS(this.buttomPMS.name)
              this.$refs[`popover-${itbm.name}-editBtm`][index].doClose()
            }
          }).catch(e => {
            this.$message({
              showClose: true,
              message: '修改失败！错误信息：' + e,
              type: 'error'
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '修改失败！请正确填写表单',
            type: 'error'
          })
        }
      })
    },
    deleRoute(item) {
      deleRoutes(item.name).then(res => {
        if (res.data === 'success') {
          this.$message({
            showClose: true,
            message: '页面删除成功！',
            type: 'success'
          })
          this.realRoutes = this.realRoutes.filter(jtem => {
            return jtem.name !== item.name
          })
          this.selected = this.getchecked(this.generateRoutes(this.realRoutes), [])
        }
      }).catch(e => {
        this.$message({
          showClose: true,
          message: '删除失败！错误信息：' + e,
          type: 'error'
        })
      })
    },
    deleChildRoute(item, itemchild) {
      deleChildRoutes(item.name, itemchild.name).then(res => {
        if (res.data === 'success') {
          this.$message({
            showClose: true,
            message: '子页面删除成功！',
            type: 'success'
          })
          this.realRoutes.forEach(jtem => {
            if (jtem.name === item.name) {
              if (jtem.children) {
                jtem.children = jtem.children.filter(btem => {
                  return btem.name !== itemchild.name
                })
              }
            }
          })
          this.selected = this.getchecked(this.generateRoutes(this.realRoutes), [])
        }
      }).catch(e => {
        this.$message({
          showClose: true,
          message: '删除失败！错误信息：' + e,
          type: 'error'
        })
      })
    },
    deleBtm(itbm) {
      deleBtm(this.buttomPMS.name, itbm.name).then(res => {
        if (res.data === 'success') {
          this.$message({
            showClose: true,
            message: '按钮删除成功！',
            type: 'success'
          })
          this.totalBPMS.forEach(item => {
            if (item.name === this.buttomPMS.name) {
              item.realBPMS = item.realBPMS.filter(jtem => {
                return jtem.name !== itbm.name
              })
            }
          })
          this.showButtomPMS(this.buttomPMS.name)
        }
      }).catch(e => {
        this.$message({
          showClose: true,
          message: '删除失败！错误信息：' + e,
          type: 'error'
        })
      })
    },
    editChildRoute(isedit, val, valchild) {
      if (isedit) {
        if (this.$refs[`editChildRoute-${val.name}-Form`][0] !== undefined) {
          this.$refs[`editChildRoute-${val.name}-Form`][0].resetFields()
        }
        this.realRoutes.forEach(item => {
          if (item.name === val.name) {
            if (item.children) {
              item.children.forEach(jtem => {
                if (jtem.name === valchild.name) {
                  this.ChildrenRoute = deepClone(jtem)
                }
              })
            }
          }
        })
      } else {
        if (this.$refs[`addChildRoute-${val.name}-Form`][0] !== undefined) {
          this.$refs[`addChildRoute-${val.name}-Form`][0].resetFields()
        }
        this.ChildrenRoute = Object.assign({}, defaultChildrenRoute)
        this.ChildrenRoute.meta = Object.assign({}, defaultMata)
      }
    },
    editRoute(isedit, val) {
      if (isedit) {
        if (this.$refs[`editRoute-${val.name}-form`][0] !== undefined) {
          this.$refs[`editRoute-${val.name}-form`][0].resetFields()
        }
        const routes = deepClone(this.realRoutes)
        let data = {}
        if (!val.children) {
          routes.forEach(item => {
            if (item.children) {
              item.children.forEach(jtem => {
                if (jtem.name === val.name) {
                  data = deepClone(item)
                }
              })
            }
          })
        } else {
          routes.forEach(item => {
            if (item.name === val.name) {
              data = deepClone(item)
            }
          })
        }
        this.ParentRoute = data
      } else {
        if (this.$refs.addRouteForm !== undefined) {
          this.$refs.addRouteForm.resetFields()
        }
        this.ParentRoute = Object.assign({}, defaultParentRoute)
        this.ParentRoute.meta = Object.assign({}, defaultMata)
      }
    },
    editBtm(isedit, itbm) {
      if (isedit) {
        if (this.$refs[`form-${itbm.name}-editBtm`][0] !== undefined) {
          this.$refs[`form-${itbm.name}-editBtm`][0].resetFields()
        }
        this.btmInfo = deepClone(itbm)
      } else {
        if (this.$refs['route-newBtm-form'] !== undefined) {
          this.$refs['route-newBtm-form'].resetFields()
        }
        this.btmInfo = Object({}, defaultBtmInfo)
      }
    },
    confirmBtm() {
      this.roleInfo.routesCount = this.roleInfo.routesCount.filter(item => {
        return item.name !== this.buttomPMS.name
      })
      this.roleInfo.routesCount.push(this.buttomPMS)
    },
    editDefaultRoutes() {
      if (this.iseditDefaultRoutes) {
        searchEvent.$emit('offCurrentRow')
        setTimeout(() => {
          this.iseditDefaultRoutes = true
          this.roleInfo = deepClone(this.defaultRole)
        }, 1000)
      } else {
        searchEvent.$emit('onCurrentRow')
      }
    },
    handleBtmCheckAllChange() {
      const list = []
      this.buttomPMS.realBPMS.forEach(item => {
        list.push(item.name)
      })
      this.buttomPMS.hasBPMS = this.buttomPMS.checkAll ? list : []
      this.isBtmIndeterminate = false
      this.confirmBtm()
      if (this.buttomPMS.checkAll) {
        this.checkedPatRoute()
      }
    },
    handleBtmCheckedChange(ischecked, name) {
      console.log(this.buttomPMS.has)
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
      this.confirmBtm()
      this.checkedPatRoute()
    },
    checkedPatRoute() {
      this.selected.forEach(item => {
        if (item.name === this.buttomPMS.name) {
          if (this.checkedRoute.indexOf(this.buttomPMS.name) < 0) {
            this.checkedRoute.push(this.buttomPMS.name)
          }
        } else {
          if (item.children) {
            item.children.forEach(jtem => {
              if (jtem.name === this.buttomPMS.name) {
                if (item.checked.indexOf(this.buttomPMS.name) < 0) {
                  item.checked.push(this.buttomPMS.name)
                  item.isIndeterminate = true
                }
              }
            })
          }
        }
      })
    },
    showButtomPMS(name) {
      this.isbuttomPMS = true
      // console.log(this.roleInfo, this.roleInfo.routesCount, name)
      const data = this.checkBPMS(deepClone(this.totalBPMS), deepClone(this.roleInfo.routesCount))
      this.roleInfo.routesCount = deepClone(data)
      this.buttomPMS = data.filter(item => {
        return item.name === name
      })[0]
      if (this.buttomPMS.checkAll) {
        this.isBtmIndeterminate = false
      } else {
        if (this.buttomPMS.hasBPMS.length > 0) {
          this.isBtmIndeterminate = true
        } else {
          this.isBtmIndeterminate = false
        }
      }
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
    checkBPMS(totalBPMS, realBPMS) {
      totalBPMS.forEach(item => {
        item.checkAll = false
        item.hasBPMS = []
      })
      totalBPMS.forEach(item => {
        if (realBPMS) {
          realBPMS.forEach(jtem => {
            if (jtem.name === item.name) {
              item.hasBPMS = deepClone(jtem.hasBPMS)
              if (item.hasBPMS.length === item.realBPMS.length) {
                item.checkAll = true
              } else {
                item.checkAll = false
              }
            }
          })
        }
      })
      return totalBPMS
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
      for (const route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        // const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        // if (route.children && onlyOneShowingChild && !route.alwaysShow) {
        //   route = onlyOneShowingChild
        // }
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

.icon-default-type {
  color: silver;
  margin-left: 5px;
  font-size: 15px;
  margin-top: 3px;
  display: inline-block;
}

.icon-default-type:hover {
  color: slategray;
  cursor: pointer;
}

.add-icon-type {
  position: absolute;
  margin-left: 70%;
  font-size: 35px;
  color: coral;
  cursor: pointer;
}

.add-icon-type:hover {
  color: red;
}
</style>
