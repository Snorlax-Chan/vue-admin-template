<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>组织架构</span>
        <el-dropdown class="el-dropdown-link" trigger="click" @command="handleCommand($event,[])">
          <el-button
            type="text"
            @click.stop=""
          >
            <svg-icon icon-class="more" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="addOrgan">添加组织</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-input
          v-model="search"
          placeholder="输入部门等搜索"
          prefix-icon="el-icon-search"
          style="border-radius: 30px;margin-bottom:5px;"
        />
      </div>
      <vxe-table
        ref="depMenu"
        resizable
        :tree-config="{children: 'children', expandAll: true}"
        :data="list"
        :show-header="false"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <vxe-table-column field="name" title="Date" tree-node>
          <template v-slot="{row}">
            {{ row.name }}
            <el-dropdown class="el-dropdown-link" trigger="click" @command="handleCommand($event,row)">
              <el-button
                type="text"
                @click.stop=""
              >
                <svg-icon icon-class="more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="addChild">添加子部门</el-dropdown-item>
                <el-dropdown-item command="editChild">修改</el-dropdown-item>
                <el-popover :ref="`popover-${row.id}-dele`" width="160" placement="top">
                  <p>确定删除该项吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="text"
                      size="mini"
                      @click="$refs[`popover-${row.id}-dele`].doClose()"
                    >取消</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="deleDp(row);$refs[`popover-${row.id}-dele`].doClose()"
                    >确定</el-button>
                  </div>
                  <el-dropdown-item slot="reference">删除</el-dropdown-item>
                </el-popover>

              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
    <el-dialog
      :title="popoverTitle"
      :visible.sync="dialogOrganVisible"
      width="30%"
      center
      class="dialog_type"
      @closed="closeDialog"
    >
      <el-card shadow="never">
        <el-form ref="ruleForm" :inline="true" :model="departmentInfo" label-position="right" class="demo-form-inline" :rules="rules" status-icon>
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="departmentInfo.name" />
          </el-form-item>
          <el-form-item label="部门简介" prop="remarks">
            <el-input v-model="departmentInfo.remarks" type="textarea" />
          </el-form-item>
          <el-form-item label="分配部门角色">
            <el-popover :ref="`popover-role`" placement="right">
              <div style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"><span>分配部门角色</span></div>
              <el-card shadow="never">
                <el-transfer
                  v-model="departmentInfo.roles"
                  filterable
                  filter-placeholder="请输入城市拼音"
                  :data="cloneRoleList"
                  :props="{
                    key: 'id',
                    label: 'name'
                  }"
                  :titles="['系统全部角色', '该部门角色']"
                />
                <el-alert
                  title="添加后数据实时更新！请在取消/确定前确认分配的角色信息！"
                  type="info"
                  width="50%"
                  show-icon
                />
              </el-card>
              <div style="text-align: right; margin: 0">
                <el-button
                  type="danger"
                  size="mini"
                  @click="$refs[`popover-role`].doClose();"
                >确定</el-button>
              </div>
              <el-button slot="reference">点此分配部门角色</el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-switch v-model="departmentInfo.status" active-color="#13ce66" />
          </el-form-item>
          <el-alert
            title="启用将激活该部门！未启用将在相关页面隐去该部门！"
            type="info"
            width="50%"
            show-icon
          />
        </el-form>
      </el-card>
      <div style="text-align: right; margin: 0">
        <el-button
          type="text"
          size="mini"
          @click="dialogOrganVisible = false;"
        >取消</el-button>
        <el-button
          v-if="popoverTitle==='新增组织'"
          type="danger"
          size="mini"
          @click="appendOrgan();"
        >确定</el-button>
        <el-button
          v-if="popoverTitle==='新增子部门'"
          type="danger"
          size="mini"
          @click="appendChild(tableRow);"
        >确定</el-button>
        <el-button
          v-if="popoverTitle==='编辑部门'"
          type="danger"
          size="mini"
          @click="update(tableRow);"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAlldep, appendDepChild, deleDepartment, updateDepInfo } from '@/api/department'
import { getRoles } from '@/api/role'
import { deepClone } from '@/utils'

const defaultDpInfo = {
  id: '',
  key: ' ',
  name: '',
  principal: '',
  content: '',
  numbers: '',
  status: '',
  remarks: '',
  roles: []
}
export default {
  name: 'DepMenu',
  data() {
    return {
      tableData: [],
      search: '',
      departmentInfo: Object.assign({}, defaultDpInfo),
      popoverTitle: '',
      tableRow: {},
      dialogOrganVisible: false,
      realRoleList: [],
      cloneRoleList: [],
      depRoles: [],
      rules: {
        name: [
          { required: true, message: '请输入部门', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '简介介绍部门职能', trigger: 'blur' }
        ],
        status: [
          { required: false, message: '请确认是否启用该部门', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    list() {
      const filterName = this.$utils.toString(this.search).trim().toLowerCase()
      if (filterName) {
        const options = { children: 'children' }
        const searchProps = ['name']
        const rest = this.$utils.searchTree(this.tableData, item => searchProps.some(key => this.$utils.toString(item[key]).toLowerCase().indexOf(filterName) > -1), options)
        return rest
      }
      return this.tableData
    }
  },
  created() {
    this.getAlldep()
    this.getRoles()
  },
  methods: {
    getRoles() {
      getRoles().then(res => {
        this.realRoleList = res.data
        this.cloneRoleList = deepClone(this.realRoleList)
      })
    },
    getAlldep() {
      getAlldep().then(res => {
        this.tableData = res.data
      })
    },
    closeDialog() {
      this.departmentInfo = Object.assign({}, defaultDpInfo)
    },
    addChild(isAdd, row) {
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields()
      }
      if (isAdd) {
        this.popoverTitle = '新增子部门'
        this.departmentInfo = Object.assign({}, defaultDpInfo)
        this.dialogOrganVisible = true
      } else {
        this.popoverTitle = '编辑部门'
        this.departmentInfo = row
        this.dialogOrganVisible = true
      }
    },
    appendOrgan() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogOrganVisible = false
          this.departmentInfo.id = (Math.ceil(Math.random() * 100)) * 3
          this.tableData.push(this.departmentInfo)
          this.$nextTick(() => {
            appendDepChild('', this.departmentInfo).then(res => {
              if (res.data === 'success') {
                this.$message({
                  showClose: true,
                  message: '新增部门成功！',
                  type: 'success'
                })
                this.$refs.depMenu.updateData()
              }
            }).catch(e => {
              this.$message({
                showClose: true,
                message: '新增部门失败,错误：' + e,
                type: 'error'
              })
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '请检查输入信息是否正确',
            type: 'error'
          })
        }
      })
    },
    addOrgan() {
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields()
      }
      this.departmentInfo = Object.assign({}, defaultDpInfo)
      this.dialogOrganVisible = true
      this.popoverTitle = '新增组织'
    },
    handleCommand(command, row) {
      this.tableRow = row
      if (command === 'addOrgan') {
        this.addOrgan()
      } else if (command === 'addChild') {
        this.addChild(true, '')
      } else if (command === 'editChild') {
        this.addChild(false, row)
      }
    },
    appendChild(row) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogOrganVisible = false
          this.departmentInfo.id = row.id + '-1'
          if (row.children) {
            row.children.push(this.departmentInfo)
          } else {
            row.children = []
            row.children.push(this.departmentInfo)
          }
          this.$nextTick(() => {
            appendDepChild(row.id, this.departmentInfo).then(res => {
              if (res.data === 'success') {
                this.$message({
                  showClose: true,
                  message: '新增部门成功！',
                  type: 'success'
                })
                this.$refs.depMenu.updateData()
              }
            }).catch(e => {
              this.$message({
                showClose: true,
                message: '新增部门失败,错误：' + e,
                type: 'error'
              })
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '请检查输入信息是否正确',
            type: 'error'
          })
        }
      })
    },
    update(row) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogOrganVisible = false
          row.name = this.departmentInfo.name
          row.remarks = this.departmentInfo.remarks
          row.status = this.departmentInfo.status
          row.roles = this.departmentInfo.roles
          this.$nextTick(() => {
            updateDepInfo(row.id, this.departmentInfo).then(res => {
              if (res.data === 'success') {
                this.$message({
                  showClose: true,
                  message: '部门信息更新成功！',
                  type: 'success'
                })
                this.$refs.depMenu.updateData()
              }
            }).catch(e => {
              this.$message({
                showClose: true,
                message: '部门信息更新失败！错误：' + e,
                type: 'error'
              })
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: '请检查输入信息是否正确',
            type: 'error'
          })
        }
      })
    },
    deleDp(row) {
      const tableData = deepClone(this.tableData)

      this.$nextTick(() => {
        deleDepartment(row.id).then(res => {
          if (res.data === 'success') {
            this.$message({
              showClose: true,
              message: '部门删除成功',
              type: 'success'
            })
            this.tableData = this.deleRow(row, tableData)
            this.$refs.depMenu.updateData()
          }
        }).catch(e => {
          this.$message({
            showClose: true,
            message: '部门删除失败：' + e,
            type: 'error'
          })
        })
      })
    },
    deleRow(row, realDate) {
      const data = realDate.filter(item => {
        if (item.children) {
          item.children = this.deleRow(row, item.children)
        }
        return item.id !== row.id
      })
      return data
    },
    handleCurrentChange(val) {
      this.$emit('handle-current-change', val)
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
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

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  box-shadow: gainsboro 0px 0px 6px;
}

.el-dropdown-link {
    cursor: pointer;
    color: gray;
    float: right;
  }

.box-card >>> .el-button--text {
  float: right;
  padding: 3px 0;
  color: grey;
  font-size: 16px;
}

.box-card >>> .el-button--text:hover{
  color: black;
}

.dialog_type >>> .el-dialog__header {
  padding: 10px 10px 10px;
  border-bottom: #cac4c4 1px solid;
  font-weight: bolder;
}
</style>
