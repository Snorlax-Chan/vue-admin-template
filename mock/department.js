import Mock from 'mockjs'
import XEUtils from 'xe-utils'
import { deepClone } from '../src/utils'

const departmentList = [{
  id: '1',
  key: 'the head office',
  name: '总公司',
  principal: '大娃',
  content: '17812345648',
  numbers: '50',
  status: true,
  remarks: '',
  children: [{
    id: '2',
    key: 'Personnal department',
    name: '人事部',
    principal: '二娃',
    content: '13858965234',
    numbers: '21',
    status: true,
    remarks: ''
  },
  {
    id: '3',
    key: 'Sales department',
    name: '销售部',
    principal: '二娃',
    content: '138246546534',
    numbers: '50',
    status: true,
    remarks: ''
  },
  {
    id: '4',
    key: 'Development department',
    name: '开发部',
    principal: '二娃',
    content: '13858965234',
    numbers: '30',
    status: true,
    remarks: ''
  }
  ]
}]

const AllDepUsers = Mock.mock({
  'AllDepUsers|108': [{
    id: '@id',
    name: '@cname',
    'role|1': [['经理'], ['经理', '超管'], ['经理', '超管', '人事']],
    'department|1': [['人事部'], ['人事部', '开发部'], ['人事部', '开发部', '销售部']],
    'status|1': Boolean,
    'sex|1': [0, 1],
    email: '@email',
    content: /^1[0-9]{10}$/,
    date: '@date'
  }]
})
// let searchList = []
let tableData = deepClone(AllDepUsers.AllDepUsers)

function sortByName(order) {
  if (order === 'asc') {
    tableData.sort((a, b) => a.name.localeCompare(b.name))
  } else if (order === 'desc') {
    tableData.sort((a, b) => b.name.localeCompare(a.name))
  }
}

function sortByContent(order) {
  if (order === 'asc') {
    tableData.sort((a, b) => a.content - b.content)
  } else if (order === 'desc') {
    tableData.sort((a, b) => b.content - a.content)
  }
}

function searchUserInfo(filterName) {
  if (filterName) {
    // const filterRE = new RegExp(filterName, 'gi')
    const searchProps = ['id', 'name', 'role', 'department', 'status', 'email', 'content', 'date']
    const rest = AllDepUsers.AllDepUsers.filter(item => searchProps.some(key => XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1))
    return rest
  }
}

function filter(property, filterName) {
  if (filterName) {
    const searchProps = [property]
    console.log(searchProps)
    const rest = AllDepUsers.AllDepUsers.filter(item => searchProps.some(key => XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1))
    return rest
  }
}

function mockUserInfo(pageSize, currentPage) {
  const AllUsers = []
  const datalist = tableData
  const startIndex = pageSize * (currentPage - 1)
  const total = datalist.length
  const endIndex = (pageSize * (currentPage - 1) + pageSize) < total ? (pageSize * (currentPage - 1) + pageSize) : total
  if (datalist) {
    for (let j = startIndex; j < endIndex; j++) {
      AllUsers.push(datalist[j])
    }
  }
  return AllUsers
}

export default [
  // show All department
  {
    url: '/showDep/Alldep',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: departmentList
      }
    }
  },

  // show department user
  {
    url: '/showDep/getTableData',
    type: 'post',
    response: res => {
      let data = []
      const { tableType, stringInfo, property, order, filterName, pageSize, currentPage } = res.body
      console.log(tableType, stringInfo, property, order, filterName, pageSize, currentPage)
      if (tableType === 'all') {
        console.log('---all------')
        tableData = deepClone(AllDepUsers.AllDepUsers)
        data = mockUserInfo(pageSize, currentPage)
      } else if (tableType === 'search') {
        console.log('---search------')
        tableData = searchUserInfo(stringInfo)
        data = mockUserInfo(pageSize, currentPage)
      } else if (tableType === 'sort') {
        if (property === 'name') {
          console.log('---property------')
          sortByName(order)
          console.log('---order---')
          data = mockUserInfo(pageSize, currentPage)
        } else if (property === 'content') {
          sortByContent(order)
          data = mockUserInfo(pageSize, currentPage)
        }
      } else if (tableType === 'filter') {
        tableData = filter(property, filterName)
        data = mockUserInfo(pageSize, currentPage)
      }
      // console.log(mockUserInfo(arr, total, pageSize, currentPage))
      // console.log(mockUserInfo(total, pageSize, currentPage))
      return {
        code: 20000,
        data: data,
        total: tableData.length
      }
    }
  },

  // change user depaertment
  {
    url: '/department/changeDp',
    type: 'post',
    response: res => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // change user status
  {
    url: '/department/changeStatus',
    type: 'post',
    response: res => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // dele users
  {
    url: '/department/deleUsers',
    type: 'post',
    response: res => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // update users
  {
    url: '/department/updateUsers',
    type: 'post',
    response: res => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // add new users
  {
    url: '/department/addNewUsers',
    type: 'post',
    response: res => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // append department child
  {
    url: '/department/appendDepChild',
    type: 'post',
    response: res => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // dele department child
  {
    url: '/department/deleDepartment',
    type: 'post',
    response: res => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
