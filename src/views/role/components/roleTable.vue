/* eslint-disable no-unused-vars */
<template>
  <vxe-table ref="roletable" resizable :data="PMSlist" :expand-config="{expandAll: true}" :show-header="false">
    <vxe-table-column field="title" title="页面列表" />
    <vxe-table-column type="expand" width="60">
      <template v-slot="{ row, rowIndex }">
        <el-checkbox
          v-model="row.checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange(row)"
        >全选</el-checkbox>
        <el-checkbox-group v-model="row.hasBPMS" style="display:inline" @change="handleCheckedChange(row)">
          <el-checkbox v-for="item in row.realBPMS" :key="item.id" :label="item.name">{{ item.title }}<el-button type="text">按钮权限</el-button></el-checkbox>
        </el-checkbox-group>
      </template>
    </vxe-table-column>
  </vxe-table>
</template>

<script>
export default {
  name: 'TreeTable',
  props: {
    routes: {
      type: Array,
      required: true,
      default: function() {
        return []
      } }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      pageList: []
    }
  },
  computed: {
    PMSlist() {
      return this.refreshData()
    }
  },
  methods: {
    refreshData() {
      this.pageList = this.routes
      this.$nextTick(() => {
        if (this.pageList) { this.$refs.roletable.reloadData(this.pageList) }
      })
    },
    handleCheckAllChange(row) {
      const list = []
      row.realBPMS.forEach(item => {
        list.push(item.name)
      })
      row.hasBPMS = row.checkAll ? list : []
    },
    handleCheckedChange(row) {
      if (row.hasBPMS.length === row.realBPMS.length) {
        row.checkAll = true
        this.isIndeterminate = false
      } else if (row.hasBPMS.length > 0) {
        this.isIndeterminate = true
        row.checkAll = false
      } else {
        this.isIndeterminate = false
        row.checkAll = false
      }
    }
  }
}
</script>

<style>
</style>
