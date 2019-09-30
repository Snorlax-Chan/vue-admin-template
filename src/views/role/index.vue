<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="人员角色分配">
        <el-row>
          <el-col :span="3">
            <role-menu />
          </el-col>
          <el-row type="flex" justify="center">
            <el-col :span="22" :offset="2">
              <role-table />
            </el-col>
          </el-row>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="角色权限设置">
        <role-permission />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RoleMenu from './components/roleMenu'
import RoleTable from './components/roleTable'
import RolePermission from './components/rolePermission'
export default {
  name: 'Role',
  components: {
    RoleMenu,
    RoleTable,
    RolePermission
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  created() {
  },
  methods: {
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
