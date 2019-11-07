<template>
  <div id="box-conier">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <vxe-toolbar id="toolbar-type">
          <template v-slot:buttons>
            <span class="textType">成员({{ tablePage.totalResult }})</span>
            <el-tooltip effect="dark" content="新增用户" placement="top">
              <el-button round class="add-type" @click="EditUsers(false,'')">
                <svg-icon icon-class="new-add" style="font-size:30px;vertical-align: middle;" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="批量调换部门" placement="top">
              <el-button circle class="icon-type" @click="changeDep">
                <svg-icon icon-class="pingyi" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="批量锁定用户" placement="top">
              <el-button circle class="icon-type" @click="changeStatus(false)">
                <svg-icon icon-class="lock" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="批量解除锁定" placement="top">
              <el-button circle class="icon-type" @click="changeStatus(true)">
                <svg-icon icon-class="unlock" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="批量删除" placement="top">
              <el-button circle class="icon-type" @click="deleUsers(false,'')">
                <svg-icon icon-class="trash" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="批量上传" placement="top">
              <el-button circle class="icon-type" @click="uploadUsers">
                <svg-icon icon-class="upload-1" />
              </el-button>
            </el-tooltip>
            <el-popover
              :ref="`popover-exportTable`"
              width="260"
              placement="top"
              style="margin-left:10px;"
            >
              <el-divider content-position="left">
                <span style="font-size: 16px;font-weight: 500;">导出数据</span>
              </el-divider>
              <el-form ref="infoForm" :model="exportFormat" label-width="80px" status-icon>
                <el-form-item label="文件名">
                  <el-input v-model="exportFormat.filename" placeholder="请输入文件名" clearable />
                </el-form-item>
                <el-form-item label="导出类型">
                  <el-select v-model="exportFormat.type" clearable placeholder="请选择">
                    <el-option
                      v-for="item in typeList"
                      :key="item.lable"
                      :label="item.title"
                      :value="item.lable"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
              <div style="text-align: right; margin: 0">
                <el-button
                  type="text"
                  size="mini"
                  @click="$refs[`popover-exportTable`].doClose()"
                >取消</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  :loading="exportloading"
                  @click="exportTable();$refs[`popover-exportTable`].doClose()"
                >导出</el-button>
              </div>
              <el-button slot="reference" circle class="icon-type">
                <svg-icon icon-class="cloud-download" />
              </el-button>
            </el-popover>
            <el-input
              v-model="search"
              placeholder="输入姓名/部门等搜索"
              prefix-icon="el-icon-search"
              class="input-type"
            />
          </template>
        </vxe-toolbar>
      </div>
      <vxe-table
        ref="depUsers"
        resizable
        :data="tableData"
        show-overflow
        height="400"
        size="mini"
        row-id="id"
        :loading="loading"
        :start-index="(tablePage.currentPage - 1) * tablePage.pageSize"
        highlight-hover-row
        :select-config="{reserve: true, trigger: 'row'}"
        :remote-sort="true"
        :remote-filter="true"
        @filter-change="filterNameMethod"
        @sort-change="sortChange"
      >
        <vxe-table-column type="checkbox" width="60" />
        <vxe-table-column type="index" title="序号" width="60" />
        <vxe-table-column field="name" title="姓名" sortable :filters="[{ data: '' }]">
          <template v-slot:filter="{ column, context }">
            <template v-for="(option, index) in column.filters">
              <el-input
                :key="index"
                v-model="option.data"
                class="my-input"
                type="type"
                placeholder="按回车确认筛选"
                @input="context.changeOption($event, !!option.data, option)"
                @keyup.enter.native="context.confirmFilter()"
              />
            </template>
          </template>
          <template v-slot="{row}">
            <el-button type="text" @click.stop="showInfo(row)">{{ row.name }}</el-button>
          </template>
        </vxe-table-column>
        <vxe-table-column field="role" title="职位" />
        <vxe-table-column field="content" title="联系方式" sortable :filters="[{ data: '' }]">
          <template v-slot:filter="{ column, context }">
            <template v-for="(option, index) in column.filters">
              <el-input
                :key="index"
                v-model="option.data"
                class="my-input"
                type="type"
                placeholder="按回车确认筛选"
                @input="context.changeOption($event, !!option.data, option)"
                @keyup.enter.native="context.confirmFilter()"
              />
            </template>
          </template>
        </vxe-table-column>
        <vxe-table-column field="department" title="部门" :filters="[{ data: [] }]">
          <template v-slot:filter="{ column, context }">
            <el-select
              v-for="(option, index) in column.filters"
              :key="index"
              v-model="option.data"
              placeholder="请选择"
              multiple
              filterable
              collapse-tags
              clearable
              popper-class="filter-select"
              :popper-append-to-body="true"
              @change="context.changeOption($event, !!option.data, option)"
            >
              <el-option-group v-for="group in depList" :key="group.id" :label="group.name">
                <el-option
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-option-group>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column field="status" title="状态" width="60">
          <template v-slot="{row}">
            <el-tooltip v-if="row.status" effect="dark" content="用户正常" placement="top">
              <svg-icon
                v-if="row.status"
                icon-class="sun"
                style="color:#25d410;font-size:20px;cursor: pointer;"
                @click.stop="changeSingleStatus(row)"
              />
            </el-tooltip>
            <el-tooltip v-if="!row.status" effect="dark" content="用户已被锁定" placement="top">
              <svg-icon
                v-if="!row.status"
                icon-class="sun"
                style="color:slategrey;font-size:20px;cursor: pointer;"
                @click.stop="changeSingleStatus(row)"
              />
            </el-tooltip>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template v-slot="{row,$rowIndex}">
            <vxe-button type="text" @click.stop="EditUsers(true,row)">编辑</vxe-button>
            <el-popover :ref="`popover-${$rowIndex}`" width="160" placement="top">
              <p>确定删除该项吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  type="text"
                  size="mini"
                  @click="$refs[`popover-${$rowIndex}`].doClose()"
                >取消</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleUsers(true,row);$refs[`popover-${$rowIndex}`].doClose()"
                >确定</el-button>
              </div>
              <vxe-button slot="reference" type="text" @click.stop>删除</vxe-button>
            </el-popover>
          </template>
        </vxe-table-column>
      </vxe-table>
      <vxe-pager
        :loading="loading"
        :current-page="tablePage.currentPage"
        :page-size="tablePage.pageSize"
        :total="tablePage.totalResult"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      />
    </el-card>

    <el-dialog
      title="批量调换部门"
      :visible.sync="dialogVisible"
      width="38%"
      :before-close="handleClose"
      class="dialog_type"
      center
    >
      <div>
        <el-select
          v-model="changeList"
          multiple
          filterable
          clearable
          collapse-tags
          style="margin-left: 20px;"
          placeholder="请选择"
        >
          <el-option v-for="item in tableData" :key="item.key" :label="item.name" :value="item.id" />
        </el-select>
        <svg-icon icon-class="arrow-right-1" style="font-size:20px;" />
        <el-select
          v-model="changedDep"
          placeholder="请选择"
          multiple
          filterable
          collapse-tags
          clearable
        >
          <el-option-group v-for="group in depList" :key="group.id" :label="group.name">
            <el-option
              v-for="item in group.children"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-option-group>
        </el-select>
      </div>
      <el-alert
        title="此功能 (批量调整部门功能) 仅支持当前页显示的用户批量操作！"
        type="info"
        show-icon
        style="width:90%;margin:20px 0px 0px 20px;"
      />
      <span slot="footer" class="dialog-footer">
        <el-button style="border-radius: 30px;" @click="dialogVisible = false">取 消</el-button>
        <el-button style="border-radius: 30px;" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="详细信息"
      :visible.sync="dialogInfoVisible"
      width="35%"
      center
      class="dialog_type"
    >
      <el-row>
        <el-col style="text-align:center">
          <el-avatar>
            <svg-icon icon-class="user-2" style="font-size: 40px;" :src="userInfo.avatar" />
          </el-avatar>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="text-align:center;vertical-align:middle;display:inline;">
          <span style="font-weight: bolder;margin:10px;">{{ userInfo.name }}</span>
        </el-col>
      </el-row>
      <div class="userinfo-body">
        <el-row>
          <el-col style="vertical-align:middle;display:inline;">
            <div class="userinfo-div">
              <span>姓名：</span>
              <span class="userinfo-span">
                {{ userInfo.name }}
                <el-tooltip v-if="userInfo.status" effect="dark" content="帐号正常" placement="right">
                  <svg-icon icon-class="sun" style="color:#25d410;font-size:20px;margin-left:3px;" />
                </el-tooltip>
                <el-tooltip
                  v-if="!userInfo.status"
                  effect="dark"
                  content="帐号异常，已被锁定"
                  placement="right"
                >
                  <svg-icon icon-class="sun" style="color:slategrey;font-size:20px;" />
                </el-tooltip>
              </span>
            </div>
            <div class="userinfo-div">
              <span>性别：</span>
              <span class="userinfo-span">
                <el-tooltip v-if="userInfo.sex === 1" effect="dark" content="男" placement="right">
                  <svg-icon icon-class="male" style="font-size:16px;color: teal;" />
                </el-tooltip>
                <el-tooltip v-if="userInfo.sex === 0" effect="dark" content="女" placement="right">
                  <svg-icon icon-class="female" style="font-size:16px;color: thistle;" />
                </el-tooltip>
              </span>
            </div>
            <div class="userinfo-div">
              <span>职位：</span>
              <span class="userinfo-span">
                <span v-for="item in userInfo.role" :key="item" style="margin-left:5px;">{{ item }}</span>
              </span>
            </div>
            <div class="userinfo-div">
              <span>部门：</span>
              <span class="userinfo-span">
                <span
                  v-for="item in userInfo.department "
                  :key="item"
                  style="margin-left:5px;"
                >{{ item }}</span>
              </span>
            </div>
            <div class="userinfo-div">
              <span>手机号：</span>
              <span class="userinfo-span">{{ userInfo.content }}</span>
            </div>
            <div class="userinfo-div">
              <span>邮箱：</span>
              <span class="userinfo-span">{{ userInfo.email }}</span>
            </div>
            <div class="userinfo-div">
              <span>入职日期：</span>
              <span class="userinfo-span">{{ userInfo.date }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer" />
    </el-dialog>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      center
      :before-close="handleClose"
      width="25%"
    >
      <el-row slot="title" style="border-bottom:1px;">
        <el-col :span="4">
          <el-button type="success" round size="small" @click="submitInfo">提交</el-button>
        </el-col>
        <el-col :span="20" style="text-align: center;">
          <span
            style="font-weight: bolder;font-weight: bolder;font-size: 25px;vertical-align: -webkit-baseline-middle;"
          >{{ drawerTitle }}</span>
        </el-col>
      </el-row>
      <el-card shadow="never">
        <div class="avatar-type">
          <span style="display: block;width: fit-content;">
            <el-popover
              :ref="`popover-avatar`"
              width="208"
              placement="left"
              popper-class="popper-avatar-type"
            >
              <el-upload
                action
                list-type="picture-card"
                :limit="1"
                :auto-upload="false"
                :on-change="handlePictureCardChange"
                :on-remove="handleRemove"
                class="upload-type"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-avatar slot="reference" :size="50" :src="dialogImageUrl">
                <svg-icon icon-class="user-2" style="font-size: 50px;" />
              </el-avatar>
            </el-popover>
          </span>
        </div>
        <div style="padding:0px 20px 20px 20px ;" class="drawerinIput-type">
          <el-form
            ref="infoForm"
            :rules="rules"
            :model="userInfo"
            label-width="80px"
            validate-on-rule-change
            status-icon
          >
            <el-form-item label="用户名" prop="name">
              <el-input v-model="userInfo.name" />
            </el-form-item>
            <el-form-item label="联系方式" prop="content">
              <el-input v-model="userInfo.content" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfo.email" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="userInfo.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-select
                v-model="userInfo.department"
                placeholder="请选择"
                multiple
                filterable
                clearable
              >
                <el-option-group v-for="group in depList" :key="group.id" :label="group.name">
                  <el-option
                    v-for="item in group.children"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="职位" prop="role">
              <el-select v-model="userInfo.role" placeholder="请选择" multiple filterable clearable>
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否激活" prop="status">
              <el-switch v-model="userInfo.status" active-color="#13ce66" inactive-color="#606266" />
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-drawer>
    <el-dialog
      title="用户批量上传"
      :visible.sync="dialogUpdateVisible"
      width="33%"
      center
      class="dialog_type"
    >
      <el-card shadow="never">
        <el-upload
          ref="updateFile"
          class="upload-demo"
          drag
          action
          :http-request="customUpload"
          :auto-upload="false"
          multiple
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div slot="tip" class="el-upload__tip">请下载对应模版文件，按需填写后上传</div>
        </el-upload>
      </el-card>
      <div style="text-align: right; margin-top: 5px;">
        <el-button type="text" @click="downloadUsersModel">点此下载批量上传用户模版</el-button>
        <el-button
          type="info"
          :loading="updateLoding"
          size="small"
          round
          @click="$refs.updateFile.submit();"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTableData, getAlldep, changeDp, changeStatus, exportTable,
  deleUsers, updateUsers, addNewUsers, fileUpdate, downloadUsersModel } from '@/api/department'
import { getRoles } from '@/api/role'
const defaultUserInfo = {
  id: '',
  name: '',
  role: '',
  department: '',
  status: '',
  sex: '',
  email: '',
  content: '',
  avatar: ''
}
const defaultExportFormat = {
  filename: '',
  type: '',
  data: []
}

export default {
  props: {
    checkedDp: {
      type: String,
      required: false,
      default: () => {
        return 'props'
      }
    }
  },
  data() {
    return {
      tableData: [],
      tableType: 'all',
      property: '',
      order: '',
      filterName: '',
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      loading: false,
      exportloading: false,
      search: '',
      dialogVisible: false,
      dialogInfoVisible: false,
      dialogUpdateVisible: false,
      updateLoding: false,
      drawer: false,
      visible: false,
      drawerTitle: '',
      changeList: [],
      changedDep: [],
      depList: [],
      rolesList: [],
      dialogImageUrl: '',
      dialogImageVisible: false,
      exportFormat: Object.assign({}, defaultExportFormat),
      userInfo: Object.assign({}, defaultUserInfo),
      typeList: [{ title: 'CSV格式(*.csv)', lable: 'csv' }, { title: '网页(*.html)', lable: 'html' }, { title: 'XML数据(*.xml)', lable: 'xml' }, { title: '文本文件(*.txt)', lable: 'txt' }],
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        email: [
          { type: 'email', required: true, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请分配部门', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请分配角色', trigger: 'blur' }
        ],
        status: [
          { required: false, message: '未激活状态！', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    checkedDp() {
      if (this.checkedDp === '总公司') {
        this.search = ''
      } else {
        this.search = this.checkedDp
        this.getTableData()
      }
    },
    tableType() {
      this.getTableData()
    },
    search() {
      const search = this.$utils.toString(this.search).trim().toLowerCase()
      if (search) {
        this.tableType = 'search'
      } else {
        this.tableType = 'all'
        // this.getAlluser()
      }
    },
    order() {
      this.tablePage.currentPage = 1
      this.getTableData()
    },
    filterName() {
      this.tablePage.currentPage = 1
      this.getTableData()
    }
  },
  created() {
    this.getTableData()
    this.getAlldep()
    this.getRoles()
  },
  methods: {
    async getTableData() {
      this.loading = true
      await getTableData(this.tableType, this.search, this.property, this.order, this.filterName, this.tablePage.pageSize, this.tablePage.currentPage).then(res => {
        this.tablePage.totalResult = res.total
        this.tableData = res.data
        this.$nextTick(() => {
          this.$refs.depUsers.updateData()
          this.loading = false
        })
      })
    },
    getRoles() {
      getRoles().then(res => {
        this.rolesList = res.data
      })
    },
    getAlldep() {
      getAlldep().then(res => {
        this.depList = res.data
      })
    },
    exportTable() {
      this.exportloading = true
      this.$nextTick(() => {
        exportTable().then(res => {
          this.exportFormat.data = res.data
          this.exportFormat.filename = this.exportFormat.filename || '员工信息表'
          this.exportFormat.type = this.exportFormat.type || 'csv'
          this.exportloading = false
          // 此方法也为导出方法
          // this.$refs.depUsers.openExport()
          this.$refs.depUsers.exportData({
            data: this.exportFormat.data,
            filename: this.exportFormat.filename,
            type: this.exportFormat.type,
            original: true
          })
          this.$message({
            showClose: true,
            message: '导出成功！',
            type: 'success'
          })
        })
      })
    },
    handleRemove(file, fileList) {
      this.dialogImageUrl = ''
      this.userInfo.avatar = ''
    },
    handlePictureCardChange(file) {
      this.userInfo.avatar = file
      this.dialogImageUrl = file.url
    },
    downloadUsersModel() {
      downloadUsersModel().then(res => {
        const a = document.createElement('a')
        a.href = res.data
        a.download = '批量下载模版'
        a.click()
        a.remove()
      })
    },
    submitInfo() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.drawer = false
          if (this.drawerTitle === '编辑用户') {
            updateUsers(this.userInfo.id, this.userInfo).then(res => {
              if (res.data === 'success') {
                this.$message({
                  showClose: true,
                  message: '用户信息成功！',
                  type: 'success'
                })
              }
            }).catch(e => {
              this.$message({
                showClose: true,
                message: '用户信息更新失败，错误：' + e,
                type: 'error'
              })
            })
          } else if (this.drawerTitle === '新增用户') {
            addNewUsers(this.userInfo).then(res => {
              if (res.data === 'success') {
                this.$message({
                  showClose: true,
                  message: '用户信息成功！',
                  type: 'success'
                })
              }
            }).catch(e => {
              this.$message({
                showClose: true,
                message: '用户信息更新失败，错误：' + e,
                type: 'error'
              })
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '提交失败，请检查信息是否填写正确',
            type: 'error'
          })
        }
      })
    },
    customUpload(file) {
      this.updateLoding = true
      fileUpdate(file).then(res => {
        if (res.data === 'success') {
          this.$message({
            showClose: true,
            message: '文件上传成功！',
            type: 'success'
          })
          this.updateLoding = false
          this.dialogUpdateVisible = false
        } else {
          this.updateLoding = false
          this.$message({
            showClose: true,
            message: '提交失败，请检查文件后重新提交',
            type: 'error'
          })
          this.dialogUpdateVisible = false
        }
      }).catch(e => {
        this.updateLoding = false
        this.$message({
          showClose: true,
          message: '提交失败，错误信息：' + e,
          type: 'error'
        })
        this.dialogUpdateVisible = false
      })
    },
    EditUsers(isEdit, row) {
      if (this.$refs.infoForm !== undefined) {
        this.$refs.infoForm.resetFields()
      }
      this.drawer = true
      this.drawerTitle = isEdit ? '编辑用户' : '新增用户'
      if (isEdit) {
        this.userInfo = row
      } else {
        this.userInfo = Object.assign({}, defaultUserInfo)
      }
    },
    changeSingleStatus(row) {
      row.status = !row.status
    },
    sortChange({ column, property, order }) {
      this.property = property
      this.order = order
      this.tableType = 'sort'
    },
    filterNameMethod({ column, property, values, datas, filters }) {
      this.tableType = 'filter'
      this.property = property
      this.filterName = datas
    },
    showInfo(row) {
      this.userInfo = row
      this.dialogInfoVisible = true
    },
    uploadUsers() {
      this.dialogUpdateVisible = true
    },
    deleUsers(boolen, row) {
      this.$nextTick(() => {
        const data = []
        if (boolen) {
          this.$refs.depUsers.remove(row).then(res => {
            // eslint-disable-next-line no-unused-vars
            data.push(row.id)
            deleUsers(data).then(res => {
              if (res.data === 'success') {
                this.$message({
                  showClose: true,
                  message: '用户删除成功！',
                  type: 'success'
                })
              }
            }).catch(e => {
              this.$message({
                showClose: true,
                message: '修改失败，错误信息：' + e,
                type: 'error'
              })
            })
          })
        } else {
          if (this.$refs.depUsers.getSelectRecords().length === 0) {
            return this.$message({
              showClose: true,
              message: '请先选中用户！',
              type: 'warning'
            })
          }
          this.$confirm('将永久删除用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs.depUsers.removeSelecteds().then(res => {
              // eslint-disable-next-line no-unused-vars
              for (const i of res.rows) {
                data.push(i.id)
              }
              deleUsers(data).then(res => {
                if (res.data === 'success') {
                  this.$message({
                    showClose: true,
                    message: '用户删除成功！',
                    type: 'success'
                  })
                }
              }).catch(e => {
                this.$message({
                  showClose: true,
                  message: '修改失败，错误信息：' + e,
                  type: 'error'
                })
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          })
        }
      })
    },
    changeStatus(boolen) {
      this.$nextTick(() => {
        const userAar = this.$refs.depUsers.getSelectRecords()
        const userId = []
        const status = boolen
        if (!userAar.length) {
          return this.$message({
            showClose: true,
            message: '请先选中用户！',
            type: 'warning'
          })
        }
        // eslint-disable-next-line no-unused-vars
        for (const j of userAar) {
          j.status = boolen
          userId.push(j.id)
        }
        changeStatus(userId, status).then(res => {
          if (res.data === 'success') {
            if (boolen) {
              this.$message({
                showClose: true,
                message: '用户锁定取消！',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: '用户状态被修改！将造成用户无法登录！',
                type: 'warning'
              })
            }
          }
        }).catch(e => {
          this.$message({
            showClose: true,
            message: '修改失败，错误信息：' + e,
            type: 'error'
          })
        })
      })
    },
    changeDep() {
      if (this.$refs.depUsers.getSelectRecords().length === 0) {
        return this.$message({
          showClose: true,
          message: '请先选中用户！',
          type: 'warning'
        })
      }
      this.dialogVisible = true
      this.changedDep = []
      this.$nextTick(() => {
        const userAar = this.$refs.depUsers.getSelectRecords()
        const data = []
        // eslint-disable-next-line no-unused-vars
        for (const j of userAar) {
          data.push(j.id)
        }
        this.changeList = data
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.getTableData()
    },
    confirm() {
      changeDp(this.changeList, this.changedDep).then(res => {
        if (res.data === 'success') {
          this.$message({
            showClose: true,
            message: '修改成功！',
            type: 'success'
          })
          this.dialogVisible = false
        }
      }).catch(e => {
        this.$message({
          showClose: true,
          message: '修改失败，错误信息：' + e,
          type: 'error'
        })
        this.dialogVisible = false
      })
    },
    handleClose(done) {
      if (this.changeList.length !== 0 || this.changedDep.length !== 0) {
        this.$confirm('存在待修改的数据，是否退出！(数据可能不会保存)', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(_ => {
            done()
          })
          .catch(_ => { })
      } else {
        done()
      }
    }
  }
}
</script>

<style scoped>
#box-conier >>> .el-card__header {
  height: 61px;
  padding: 4px 20px;
  vertical-align: middle;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.el-card__body {
  height: 100vh;
}
.textType {
  color: slategray;
  margin-right: 30px;
}
.icon-type {
  font-size: 20px;
  padding: 10px;
}
.vxe-toolbar >>> .add-type {
  background: #606266;
  color: papayawhip;
  padding: 5px 5px 5px 5px;
  vertical-align: top;
}
.vxe-toolbar >>> .add-type:hover {
  color: #54ea39;
  border-color: #d1d6dc;
  background-color: #8d929c;
}

.vxe-toolbar >>> .add-type:focus {
  color: #54ea39;
  border-color: #d1d6dc;
  background-color: #8d929c;
  transform: rotate(360deg);
  transition: 1.5s;
}

.vxe-toolbar >>> .icon-type:focus,
.vxe-toolbar >>> .icon-type:hover {
  color: papayawhip;
  border-color: #d1d6dc;
  background-color: #606266;
}
.input-type {
  float: right;
  width: 220px;
}
.vxe-toolbar >>> .el-input__inner {
  float: right;
  width: 220px;
  border-radius: 30px;
}
.vxe-toolbar >>> .vxe-button--wrapper {
  width: 100%;
}

.dialog_type >>> .el-dialog__header {
  padding: 10px 10px 10px;
  border-bottom: #cac4c4 1px solid;
  font-weight: bolder;
}

.userinfo-body {
  padding: 5% 15% 0;
}

.userinfo-body >>> .userinfo-div {
  padding: 12px;
  border-bottom: 1px;
  border-bottom-style: solid;
  border-color: #e8e6e6;
}

.userinfo-body >>> .userinfo-span {
  float: right;
  margin-right: 30px;
}

.drawerinIput-type >>> .el-input__inner {
  border-radius: 30px;
}

.avatar-type {
  text-align: -webkit-center;
  margin-bottom: 20px;
  cursor: pointer;
}

.avatar-type:hover::after {
  content: "编辑";
  z-index: 2;
  position: absolute;
  font-size: small;
  margin: -22px -1px -16px -22px;
  background-color: #8de2de;
  color: #6090b9;
  padding: 2px 10px 1px 10px;
  opacity: 0.8;
  border-radius: 0 0 21px 21px;
}

.upload-type >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 78px;
  height: 78px;
}

.upload-type >>> .el-upload--picture-card {
  width: 78px;
  height: 78px;
  line-height: 78px;
}
</style>
<style >
.popper-avatar-type {
  background-color: #b9b9b9;
}
</style>

