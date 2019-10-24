<template>
  <div id="box-conier">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <vxe-toolbar id="toolbar-type">
          <template v-slot:buttons>
            <span class="textType">成员({{ tablePage.totalResult }})</span>
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
              <el-button circle class="icon-type" @click="deleUsers(false)">
                <svg-icon icon-class="trash" />
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="新增用户" placement="top">
              <el-button round class="add-type" @click="EditUsers(false)">
                <svg-icon icon-class="pluss-2" style="font-size:30px;vertical-align: middle;" />
                <span style="padding: 0px 8px 0px 0px;">新增</span>
              </el-button>
            </el-tooltip>
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
        height="460"
        size="mini"
        row-id="id"
        :loading="loading"
        :start-index="(tablePage.currentPage - 1) * tablePage.pageSize"
        highlight-hover-row
        :select-config="{reserve: true, trigger: 'row'}"
      >
        <vxe-table-column type="selection" width="60" />
        <vxe-table-column type="index" title="序号" width="60" />
        <vxe-table-column field="name" title="姓名">
          <template v-slot="{row}">
            <el-button type="text" @click="showInfo(row)">{{ row.name }}</el-button>
          </template>
        </vxe-table-column>
        <vxe-table-column field="role" title="职位" />
        <vxe-table-column field="content" title="联系方式" />
        <vxe-table-column field="department" title="部门" />
        <vxe-table-column field="status" title="状态">
          <template v-slot="{row}">
            <el-tooltip v-if="row.status" effect="dark" content="用户正常" placement="top">
              <svg-icon v-if="row.status" icon-class="sun" style="color:#25d410;font-size:20px;" />
            </el-tooltip>
            <el-tooltip v-if="!row.status" effect="dark" content="用户已被锁定" placement="top">
              <svg-icon v-if="!row.status" icon-class="sun" style="color:slategrey;font-size:20px;" />
            </el-tooltip>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template v-slot="{row}">
            <vxe-button type="text" @click="EditUsers(row)">编辑</vxe-button>
            <vxe-button type="text" @click="deleUsers(row)">删除</vxe-button>
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

    <el-dialog title="批量调换部门" :visible.sync="dialogVisible" width="38%" :before-close="handleClose">
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
          <svg-icon icon-class="user-2" style="font-size:50px;" />
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
                  <svg-icon
                    icon-class="sun"
                    style="color:#25d410;font-size:20px;margin-left:3px;"
                  />
                </el-tooltip>
                <el-tooltip v-if="!userInfo.status" effect="dark" content="帐号异常，已被锁定" placement="right">
                  <svg-icon
                    icon-class="sun"
                    style="color:slategrey;font-size:20px;"
                  />
                </el-tooltip>
              </span>
            </div>
            <div class="userinfo-div">
              <span>性别：</span>
              <span class="userinfo-span">
                <el-tooltip v-if="userInfo.sex === 1" effect="dark" content="男" placement="right">
                  <svg-icon
                    icon-class="male"
                    style="font-size:16px;color: teal;"
                  />
                </el-tooltip>
                <el-tooltip v-if="userInfo.sex === 0" effect="dark" content="女" placement="right">
                  <svg-icon
                    icon-class="female"
                    style="font-size:16px;color: thistle;"
                  />
                </el-tooltip>
              </span>
            </div>
            <div class="userinfo-div">
              <span>职位：</span>
              <span class="userinfo-span">{{ userInfo.role }}</span>
            </div>
            <div class="userinfo-div">
              <span>部门：</span>
              <span class="userinfo-span">{{ userInfo.department }}</span>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      width="35%"
      center
      class="dialog_type"
    >

      <span slot="footer" class="dialog-footer" />
    </el-dialog>
  </div>
</template>

<script>
import { getAlluser, getAlldep, changeDp, changeStatus, deleUsers } from '@/api/department'
export default {
  data() {
    return {
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 88
      },
      loading: false,
      search: '',
      dialogVisible: false,
      dialogInfoVisible: false,
      dialogEditVisible: false,
      dialogTitle: '',
      changeList: [],
      changedDep: [],
      depList: [],
      userInfo: {
        id: '',
        name: '',
        role: '',
        department: '',
        status: '',
        sex: '',
        email: '',
        content: ''
      }
    }
  },
  created() {
    this.getAlluser(this.tablePage.totalResult, this.tablePage.pageSize, this.tablePage.currentPage)
    this.getAlldep()
  },
  methods: {
    getAlldep() {
      getAlldep().then(res => {
        this.depList = res.data
      })
    },
    getAlluser(total, tablePage, currentPage) {
      // const data = { total: this.totalResult ,pageSize:this.pageSize, }
      this.loading = true
      getAlluser(total, tablePage, currentPage).then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    EditUsers(isEdit) {
      this.dialogEditVisible = true
      this.dialogTitle = isEdit ? '编辑' : '新建'
    },
    showInfo(row) {
      this.userInfo = row
      this.dialogInfoVisible = true
    },
    deleUsers(row) {
      this.$confirm('将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$nextTick(() => {
          const data = []
          if (row) {
            console.log(row)
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
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
        console.log(this.changeList)
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.getAlluser(this.tablePage.totalResult, this.tablePage.pageSize, this.tablePage.currentPage)
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
  padding: 5px 2px 2px 2px;
  vertical-align: top;
}
.vxe-toolbar >>> .add-type:hover,
.vxe-toolbar >>> .add-type:focus{
color: #54ea39;
  border-color: #d1d6dc;
  background-color: #8d929c;
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
</style>
