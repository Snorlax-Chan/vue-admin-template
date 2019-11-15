<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="角色数据权限" style="height:100vh;">
        <el-row>
          <el-col :span="6">
            <table-menu @handle-current-change="showRolePMS" />
          </el-col>
          <el-col :span="18">
            <role-pms :assign="rolePMSlist" />
            <!-- <role-table :routes="rolePMSlist" /> -->
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="角色页面权限" style="height:100vh;">
        <role-permission />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import RoleTable from './components/roleTable'
import RolePms from './components/rolePMS'
import RolePermission from './components/rolePermission'
import TableMenu from './components/tableMenu'
export default {
  name: 'Role',
  components: {
    // RoleTable,
    RolePms,
    RolePermission,
    TableMenu
  },
  data() {
    return {
      rolePMSlist: {}
    }
  },
  created() {

  },
  methods: {
    showRolePMS(val) {
      const data = {
        id: 'test',
        key: 'test',
        name: 'null',
        description: '角色列表中无数据，请新建一个！',
        routes: [],
        routesCount: []
      }
      this.rolePMSlist = val || data
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
