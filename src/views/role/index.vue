<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="角色数据权限" style="height:100vh;">
        <el-row>
          <el-col :span="4">
            <table-menu @handle-current-change="showRolePMS" />
          </el-col>
          <el-row type="flex" justify="center">
            <el-col :span="20" :offset="1">
              <role-table :routes="rolePMSlist" />
            </el-col>
          </el-row>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="角色权限设置" style="height:100vh;">
        <role-permission />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RoleTable from './components/roleTable'
import RolePermission from './components/rolePermission'
import TableMenu from './components/tableMenu'
export default {
  name: 'Role',
  components: {
    RoleTable,
    RolePermission,
    TableMenu
  },
  data() {
    return {
      rolePMSlist: []
    }
  },
  created() {

  },
  methods: {
    showRolePMS(val) {
      this.rolePMSlist = val.routesCount
      console.log('收到数据', this.rolePMSlist)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  box-shadow: gainsboro 0px 0px 6px;
}
</style>
