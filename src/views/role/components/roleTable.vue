/* eslint-disable no-unused-vars */
<template>
  <vxe-table ref="roletable" resizable :data="PMSlist" row-id="name">
    <vxe-table-column field="title" title="页面列表" />
    <vxe-table-column type="expand" width="60">
      <template v-slot="{ row, rowIndex }">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange(row)"
        >全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="row.hasBPMS" @change="handleCheckedChange(row)">
          <el-checkbox v-for="item in row.realBPMS" :key="item.id" :label="item.id">{{ item.title }}</el-checkbox>
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
        list.push(item.id)
      })
      row.hasBPMS = this.checkAll ? list : []
    },
    handleCheckedChange(row) {
      if (row.hasBPMS.length === row.realBPMS.length) {
        this.checkAll = true
        this.isIndeterminate = false
      } else if (row.hasBPMS.length > 0) {
        this.isIndeterminate = false
        this.checkAll = false
      }
    }
  }
}
</script>

<style>
</style>
