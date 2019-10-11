/* eslint-disable no-unused-vars */
<template>
  <vxe-table
    resizable
    :row-class-name="getRowClass"
    :data="routes"
    row-id="name"
    :select-config="{checkRowKeys: checkedRoutes}"
    @select-change="selectChangeEvent"
  >
    <vxe-table-column type="selection" title="全选" width="80" tree-node />
    <vxe-table-column field="title" title="列表" tree-node />
    <vxe-table-column type="expand" width="60">
      <template v-slot="{ row, rowIndex }">
        <el-checkbox-group v-model="row.checked" @change="handleCheckedChange(rowIndex)">
          <el-checkbox
            v-for="item in row.children"
            :key="item.path"
            :label="item.title"
          >{{ item.title }}</el-checkbox>
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
      } },
    checkedRoute: {
      type: Array,
      required: true,
      default: function() {
        return []
      } }
  },
  data() {
    return {
    }
  },
  computed: {
    checkedRoutes() {
      return this.checkedRoute
    }
  },
  methods: {
    selectChangeEvent({ rowIndex, checked }) {
      if (this.routes[rowIndex].children) {
        this.routes[rowIndex].checkAll = checked
        this.handleCheckAllChange(rowIndex)
      }
    },
    getRowClass({ row, index }) {
      const res = []
      if (!row.children) { // 即该行没有子元素时，添加row-expand-cover类
        res.push('row-expand-cover')
      }
      return res
    },
    handleCheckAllChange(val) {
      // route = this.selected[val].children.filter(item => {
      //   const res = {}
      //   for(const i in route)
      //   return res
      // })
      console.log(val)
      const route = []
      this.routes[val].children.filter(item => {
        route.push(item.title)
      })
      this.routes[val].checked = this.routes[val].checkAll ? route : []
      this.isIndeterminate = false
      // if (!this.routes[val].checked) {
      //   this.checkedRoute = this.checkedRoutes.filter(item => {
      //     return item !== this.routes[val].title
      //   })
      // }
    },
    handleCheckedChange(value) {
      const route = []
      this.routes[value].children.filter(item => {
        route.push(item.title)
      })
      const checkedCount = this.routes[value].checked.length
      this.routes.checkAll = checkedCount === route.length
      if (!this.routes.checkAll) {
        this.checkedRoute = this.checkedRoute.filter(item => {
          if (item !== this.routes[value].name) {
            console.log(this.routes[value].name)
            console.log('未删除' + item)
            return item
          }
        })
        console.log('选中id为' + this.checkedRoute)
      }
      console.log(this.checkAll)
      this.isIndeterminate = checkedCount > 0 && checkedCount < route.length
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.row-expand-cover .vxe-table--expanded {
  visibility: hidden;
}
</style>
