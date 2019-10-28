<template>
  <div class="icons-container">
    <el-row>
      <el-col :span="6"><dep-menu @handle-current-change="showData" /></el-col>
      <el-col :span="18"><dep-users :checked-dp="checkedDp" /></el-col>
    </el-row>
  </div>
</template>

<script>
import DepMenu from './compoments/depMenu'
import DepUsers from './compoments/depUsers'

export default {
  name: 'Person',
  components: {
    DepMenu,
    DepUsers
  },
  data() {
    return {
      checkedDp: ''
    }
  },

  methods: {
    showData(val) {
      this.checkedDp = val.row.name
      console.log(val.row.name)
    }
  }
}
</script>

<style scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  box-shadow: gainsboro 0px 0px 6px;
  height: 100vh;
}
</style>

