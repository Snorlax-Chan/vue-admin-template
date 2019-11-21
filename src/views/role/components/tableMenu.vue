<template>
  <div>
    <el-card class="box-card" shadow="never" style="height: 80vh;">
      <div slot="header" class="clearfix">
        <span>角色列表</span>
        <el-popover :ref="`popover-add`" width="360" placement="top">
          <div style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"><span>新建角色</span></div>
          <el-card shadow="never">
            <el-form
              ref="infoForm2"
              :rules="rules"
              :model="currentRow"
              label-width="80px"
              validate-on-rule-change
              status-icon
            >
              <el-form-item label="角色名" prop="name">
                <el-input v-model="currentRow.name" clearable />
              </el-form-item>
              <el-form-item label="角色描述" prop="description">
                <el-input v-model="currentRow.description" type="textarea" clearable />
              </el-form-item>

              <el-form-item label="复制权限" prop="department">
                <el-select
                  v-model="routeName"
                  placeholder="复制已存在权限!(非必选)"
                  @change="clonePMS"
                >
                  <el-option
                    v-for="item in roleAllPMS"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-alert
                title="新角色权限可复制已存在角色！也可自定义，请在详情页设置！"
                type="info"
                show-icon
                :closable="false"
                style="margin-bottom:5px;"
              />
            </el-form>
            <div style="text-align: right; margin: 0">
              <el-button
                type="text"
                size="mini"
                @click="$refs[`popover-add`].doClose();"
              >取消</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="$refs[`popover-add`].doClose();addRole();"
              >确定</el-button>
            </div>
          </el-card>
          <span slot="reference" class="icon-type" @click.stop="newRole()">
            <svg-icon icon-class="add" class="icon-type" />
          </span>
        </el-popover>
      </div>
      <el-input
        v-model="search"
        placeholder="输入关键词搜索"
        clearable
        style="margin-bottom:10px;"
        prefix-icon="el-icon-search"
      />
      <el-table
        ref="singleTable"
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        highlight-current-row
        style="width: 100%"
        :show-header="false"
        @current-change="handleCurrentChange"
      >
        <el-table-column property="name" label="角色名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <el-popover :ref="`popover-${scope.row.id}-dele`" width="160" placement="top">
              <p>确定删除该项吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  type="text"
                  size="mini"
                  @click="$refs[`popover-${scope.row.id}-dele`].doClose()"
                >取消</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click.stop="deleRole(scope.row);$refs[`popover-${scope.row.id}-dele`].doClose()"
                >确定</el-button>
              </div>
              <span slot="reference" class="icon-type" @click.stop="">
                <svg-icon icon-class="trash" />
              </span>
            </el-popover>

            <el-popover :ref="`popover-${scope.row.id}-edit`" width="360" placement="top">
              <div style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"><span>编辑角色</span></div>
              <el-card shadow="never">
                <el-form
                  ref="infoForm"
                  :rules="rules"
                  :model="currentRow"
                  label-width="80px"
                  validate-on-rule-change
                  status-icon
                >
                  <el-form-item label="角色名" prop="name">
                    <el-input v-model="currentRow.name" clearable />
                  </el-form-item>
                  <el-form-item label="角色描述" prop="description">
                    <el-input v-model="currentRow.description" type="textarea" clearable />
                  </el-form-item>
                </el-form>
                <div style="text-align: right; margin: 0">
                  <el-button
                    type="text"
                    size="mini"
                    @click="$refs[`popover-${scope.row.id}-edit`].doClose();"
                  >取消</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="confirmRole(scope.row);$refs[`popover-${scope.row.id}-edit`].doClose();"
                  >确定</el-button>
                </div>
              </el-card>
              <span slot="reference" class="icon-type" @click.stop="editRole(scope.row)">
                <svg-icon icon-class="edit-2" />
              </span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRoleAllEditPMS, updateRole, addRole, getdefaultRole } from '@/api/role'
import { deepClone } from '@/utils'
import searchEvent from './SearchEvent'
const defaultRole = {
  id: '',
  key: '',
  name: '',
  description: '',
  routes: [],
  routesCount: []
}
export default {
  data() {
    return {
      tableData: [],
      roleAllPMS: [],
      defaultRole: {},
      routeName: '',
      currentRow: Object.assign({}, defaultRole),
      search: '',
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
  },
  mounted() {
    searchEvent.$on('offCurrentRow', () => {
      this.$nextTick(() => {
        this.$refs.singleTable.setCurrentRow()
      })
    })

    searchEvent.$on('onCurrentRow', () => {
      this.$nextTick(() => {
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
      })
    })
  },
  created() {
    this.getdefaultRole()
    getRoleAllEditPMS().then(res => {
      this.tableData = deepClone(res.data)
      this.roleAllPMS = deepClone(res.data)
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.singleTable.setCurrentRow(this.tableData[0])
        })
      }, 1000)
    })
  },
  methods: {
    getdefaultRole() {
      getdefaultRole().then(res => {
        this.defaultRole = res.data
      })
    },
    clonePMS(item) {
      this.routeName = item.name
      this.currentRow.routes = deepClone(item.routes)
      this.currentRow.routesCount = deepClone(item.routesCount)
    },
    addRole() {
      addRole(this.currentRow).then(res => {
        this.currentRow.id = res.data.id
        this.currentRow.key = res.data.keys
        if (this.currentRow.routesCount.length === 0) {
          this.currentRow.routesCount = res.data.routesCount
        }
        this.tableData.push(this.currentRow)
        this.$nextTick(() => {
          this.$refs.singleTable.setCurrentRow(this.tableData[this.tableData.length - 1])
        })
      })
    },
    newRole() {
      if (this.$refs.infoForm2 !== undefined) {
        this.$refs.infoForm2.resetFields()
      }
      this.currentRow = Object.assign({}, defaultRole)
      this.routeName = ''
    },
    editRole(row) {
      this.currentRow = new Array('')
      if (this.$refs.infoForm !== undefined) {
        this.$refs.infoForm.resetFields()
      }
      this.currentRow = deepClone(row)
    },
    confirmRole(row) {
      updateRole(this.currentRow.id, this.currentRow).then(res => {
        if (res.data.status === 'success') {
          row.name = this.currentRow.name
          row.description = this.currentRow.description
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
    deleRole(row) {
      this.$nextTick(() => {
        this.$refs.singleTable.setCurrentRow()
        this.tableData = this.tableData.filter(item => {
          return item.id !== row.id
        })
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
      })
    },
    handleCurrentChange(val) {
      if (!val) {
        this.currentRow = deepClone(this.defaultRole)
      } else {
        this.currentRow = deepClone(val)
      }
      this.$emit('handle-current-change', this.currentRow)
    }
  }
}
</script>
<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.icon-type {
  float: right;
  margin-left: 5px;
  color: silver;
}
.icon-type:hover {
  float: right;
  margin-left: 5px;
  color: unset;
  cursor: pointer;
}
</style>
