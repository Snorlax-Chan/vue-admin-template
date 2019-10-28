<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>组织架构</span>
        <el-dropdown class="el-dropdown-link">
          <el-button
            type="text"
          >
            <svg-icon icon-class="more" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-popover :ref="`popover-new-add`" width="360" placement="top">
              <div style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"><span>新增组织</span></div>
              <el-card shadow="never">
                <el-form :inline="true" :model="departmentInfo" class="demo-form-inline" :rules="rules" status-icon>
                  <el-form-item label="部门名称" prop="name">
                    <el-input v-model="departmentInfo.name" />
                  </el-form-item>
                  <el-form-item label="部门简介" prop="remarks">
                    <el-input v-model="departmentInfo.remarks" type="textarea" />
                  </el-form-item>
                  <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="departmentInfo.status" active-color="#13ce66" inactive-color="#606266" />
                  </el-form-item>
                  <el-alert
                    title="启用将开启相关功能！"
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
                  @click="$refs[`popover-new-add`].doClose()"
                >取消</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="appendOrgan();$refs[`popover-new-add`].doClose();"
                >确定</el-button>
              </div>
              <el-dropdown-item slot="reference"><div @click="addOrgan">添加组织</div></el-dropdown-item>
            </el-popover>

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
            <el-dropdown class="el-dropdown-link">
              <el-button
                type="text"
              >
                <svg-icon icon-class="more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-popover :ref="`popover-${row.id}-add`" width="360" placement="top">
                  <div style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"><span>{{ popoverTitle }}</span></div>
                  <el-card shadow="never">
                    <el-form :inline="true" :model="departmentInfo" class="demo-form-inline" :rules="rules" status-icon>
                      <el-form-item label="部门名称" prop="name">
                        <el-input v-model="departmentInfo.name" />
                      </el-form-item>
                      <el-form-item label="部门简介" prop="remarks">
                        <el-input v-model="departmentInfo.remarks" type="textarea" />
                      </el-form-item>
                      <el-form-item label="是否启用" prop="status">
                        <el-switch v-model="departmentInfo.status" active-color="#13ce66" inactive-color="#606266" />
                      </el-form-item>
                      <el-alert
                        title="启用将开启相关功能！"
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
                      @click="$refs[`popover-${row.id}-add`].doClose()"
                    >取消</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="$refs[`popover-${row.id}-add`].doClose();appendChild(row)"
                    >确定</el-button>
                  </div>
                  <el-dropdown-item slot="reference"><span @click="addChild(true,'')">添加子部门</span></el-dropdown-item>
                </el-popover>
                <el-popover :ref="`popover-${row.id}-edit`" width="360" placement="top">
                  <div style="padding-bottom: 15px;text-align: center;font-size: 18px;font-weight: 900;"><span>{{ popoverTitle }}</span></div>
                  <el-card shadow="never">
                    <el-form :inline="true" :model="departmentInfo" class="demo-form-inline" :rules="rules" status-icon>
                      <el-form-item label="部门名称" prop="name">
                        <el-input v-model="departmentInfo.name" />
                      </el-form-item>
                      <el-form-item label="部门简介" prop="remarks">
                        <el-input v-model="departmentInfo.remarks" type="textarea" />
                      </el-form-item>
                      <el-form-item label="是否启用" prop="status">
                        <el-switch v-model="departmentInfo.status" active-color="#13ce66" inactive-color="#606266" />
                      </el-form-item>
                      <el-alert
                        title="启用将开启相关功能！"
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
                      @click="$refs[`popover-${row.id}-edit`].doClose()"
                    >取消</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="$refs[`popover-${row.id}-edit`].doClose();update(row)"
                    >确定</el-button>
                  </div>
                  <el-dropdown-item slot="reference"><div @click="addChild(false,row)">修改</div></el-dropdown-item>
                </el-popover>
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
  </div>
</template>

<script>
import { getAlldep, appendDepChild, deleDepartment } from '@/api/department'
import { deepClone } from '@/utils'

const defaultDpInfo = {
  id: '',
  key: ' ',
  name: '',
  principal: '',
  content: '',
  numbers: '',
  status: '',
  remarks: ''
}
export default {
  name: 'DepMenu',
  data() {
    return {
      tableData: [],
      search: '',
      departmentInfo: Object.assign({}, defaultDpInfo),
      popoverTitle: '',
      rules: {
        name: [
          { required: true, message: '请输入部门', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' }
        ],
        remarks: [
          { required: false, message: '简介介绍部门职能', trigger: 'blur' }
        ],
        status: [
          { type: 'boolen', required: false, message: '请确认是否启用该部门', trigger: 'change' }
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
  },
  methods: {
    getAlldep() {
      getAlldep().then(res => {
        this.tableData = res.data
      })
    },
    addChild(isAdd, row) {
      if (isAdd) {
        this.popoverTitle = '新增子部门'
        this.departmentInfo = Object.assign({}, defaultDpInfo)
      } else {
        this.popoverTitle = '编辑部门'
        this.departmentInfo = row
      }
    },
    appendOrgan() {
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
            this.$refs.depMenu.reloadData(this.tableData)
          }
        }).catch(e => {
          this.$message({
            showClose: true,
            message: '新增部门失败,错误：' + e,
            type: 'error'
          })
        })
      })
      console.log(this.departmentInfo.id)
    },
    addOrgan() {
      this.departmentInfo = Object.assign({}, defaultDpInfo)
    },
    appendChild(row) {
      this.departmentInfo.id = row.id + '-1'
      console.log(this.departmentInfo)
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
            this.$refs.depMenu.reloadData(this.tableData)
          }
        }).catch(e => {
          this.$message({
            showClose: true,
            message: '新增部门失败,错误：' + e,
            type: 'error'
          })
        })
      })
    },
    update(row) {
      row.name = this.departmentInfo.name
      row.remarks = this.departmentInfo.remarks
      row.status = this.departmentInfo.status
      this.$message({
        showClose: true,
        message: '部门信息修改成功！',
        type: 'success'
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
            this.$refs.depMenu.reloadData(this.tableData)
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

</style>
