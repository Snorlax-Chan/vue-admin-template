<template>
  <div style="height: 80vh;">
    <el-input v-model="search" placeholder="输入关键词搜索" clearable />
    <el-table
      ref="singleTable"
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column property="name" label="角色名" />
    </el-table>
  </div>
</template>

<script>
import { getRoleAllEditPMS } from '@/api/role'
export default {
  data() {
    return {
      tableData: [],
      currentRow: null,
      search: ''
    }
  },
  created() {
    getRoleAllEditPMS().then(res => {
      this.tableData = res.data
      this.$nextTick(() => {
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
      })
    })
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val
      this.$emit('handle-current-change', val)
    }
  }
}
</script>
