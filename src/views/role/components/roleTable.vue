<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column label="ID" width="60" type="index" :index="1" align="center" />
          <el-table-column label="姓名" width="130">
            <template slot-scope="scope">
              <p>{{ scope.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column label="部门" width="130">
            <template slot-scope="scope">
              <p>{{ scope.row.department }}</p>
            </template>
          </el-table-column>
          <el-table-column label="角色" width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.roles }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUser } from '@/api/user'
import { getRoles } from '@/api/role'
export default {
  name: 'RoleTable',
  data() {
    return {
      tableData: [],
      rolesList: [],
      dialogFormVisible: false
    }
  },
  created() {
    const tableData = []
    getAllUser().then(res => {
      for (const key in res.data) {
        tableData.push(res.data[key])
      }
      this.tableData = tableData
      console.log(this.tableData)
    })
    this.getRoles()
  },
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    }
  }
}
</script>

<style>
</style>
