<template>
  <div style="height: 80vh;">
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
      <el-menu :default-active="activeIndex">
        <el-menu-item index="1">全部用户</el-menu-item>
        <el-menu-item-group title="角色分类">
          <el-menu-item v-for="item in roleList" :key="item.index">{{ item }}</el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { getRoleName } from '@/api/user'
export default {
  name: 'RoleMenu',
  data() {
    return {
      roleList: [],
      activeIndex: '1'
    }
  },
  created() {
    getRoleName().then(res => {
      this.roleList = res.data
    })
  }

}
</script>

<style>
.scrollbar-wrapper {
  overflow-x: hidden;
}
</style>
