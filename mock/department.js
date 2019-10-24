import Mock from 'mockjs'

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
    'role|1': ['经理', '超管', '人事'],
    'department|1': ['人事部', '开发部', '销售部'],
    'status|1': Boolean,
    'sex|1': [0, 1],
    email: '@email',
    content: /^1[0-9]{10}$/,
    date: '@date'
  }]
})

function mockUserInfo(total, pageSize, currentPage) {
  const AllUsers = []
  const datalist = AllDepUsers.AllDepUsers
  console.log(datalist)
  const startIndex = pageSize * (currentPage - 1)
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
  // show All department user
  {
    url: '/showDep/Alluser',
    type: 'post',
    response: res => {
      const { total, pageSize, currentPage } = res.body
      // console.log(mockUserInfo(total, pageSize, currentPage))
      return {
        code: 20000,
        data: mockUserInfo(total, pageSize, currentPage)
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
  }
]
