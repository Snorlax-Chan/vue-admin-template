<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>组织架构</span>
        <el-button
          type="text"
        >
          <svg-icon icon-class="more" />
        </el-button>
      </div>
      <vxe-table
        resizable
        :tree-config="{children: 'children'}"
        :data="tableData"
        :show-header="false"
        highlight-current-row
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
                <el-dropdown-item>添加子部门</el-dropdown-item>
                <el-dropdown-item>修改部门</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
  </div>
</template>

<script>
import { getAlldep } from '@/api/department'
export default {
  name: 'DepMenu',
  data() {
    return {
      tableData: []
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
