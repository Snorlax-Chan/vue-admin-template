import Mock from 'mockjs'
import XEUtils from 'xe-utils'

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
let searchList = []
function searchUserInfo(filterName) {
  if (filterName) {
    // const filterRE = new RegExp(filterName, 'gi')
    const searchProps = ['id', 'name', 'role', 'department', 'status', 'email', 'content', 'date']
    const rest = AllDepUsers.AllDepUsers.filter(item => searchProps.some(key => XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1))
    searchList = rest
    console.log(rest)
    return rest
  }
}

function mockUserInfo(arr, total, pageSize, currentPage) {
  const AllUsers = []
  const datalist = arr
  console.log(total, pageSize, currentPage)
  const startIndex = pageSize * (currentPage - 1)
  const endIndex = (pageSize * (currentPage - 1) + pageSize) < total ? (pageSize * (currentPage - 1) + pageSize) : total
  if (datalist) {
    for (let j = startIndex; j < endIndex; j++) {
      AllUsers.push(datalist[j])
    }
  }
  console.log(AllUsers)
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

  // get all user length
  {
    url: '/department/getAllUsersLength',
    type: 'get',
    response: res => {
      console.log('是否收到了第一个函数请求')
      const len = AllDepUsers.AllDepUsers.length
      return {
        code: 20000,
        data: len
      }
    }
  },

  // show All department user
  {
    url: '/showDep/Alluser',
    type: 'post',
    response: res => {
      console.log('是否收到了第二个函数请求')
      const { total, pageSize, currentPage } = res.body
      const arr = AllDepUsers.AllDepUsers
      // console.log(mockUserInfo(arr, total, pageSize, currentPage))
      // console.log(mockUserInfo(total, pageSize, currentPage))
      return {
        code: 20000,
        data: mockUserInfo(arr, total, pageSize, currentPage)
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
  },

  // get searched department length
  {
    url: '/department/getSearchedLength',
    type: 'post',
    response: res => {
      console.log(res.body)
      searchUserInfo(res.body.stringInfo)
      const total = searchList.length
      console.log(total)
      return {
        code: 20000,
        data: total
      }
    }
  },

  // get searched user info
  {
    url: '/showDep/getSeacheduser',
    type: 'post',
    response: res => {
      const { total, pageSize, currentPage } = res.body
      const arr = searchList
      // console.log(mockUserInfo(total, pageSize, currentPage))
      return {
        code: 20000,
        data: mockUserInfo(arr, total, pageSize, currentPage)
      }
    }
  }
]
