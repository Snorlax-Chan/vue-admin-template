import request from '@/utils/request'

export function getAlldep() {
  return request({
    url: '/showDep/Alldep',
    method: 'get'
  })
}

export function getAllUsersLength() {
  return request({
    url: '/department/getAllUsersLength',
    method: 'get'
  })
}

export function getAlluser(total, pageSize, currentPage) {
  return request({
    url: '/showDep/Alluser',
    method: 'post',
    data: { total: total, pageSize: pageSize, currentPage: currentPage }
  })
}

export function getSeacheduser(total, pageSize, currentPage) {
  return request({
    url: '/showDep/getSeacheduser',
    method: 'post',
    data: { total: total, pageSize: pageSize, currentPage: currentPage }
  })
}

export function changeDp(userId, dpId) {
  return request({
    url: '/department/changeDp',
    method: 'post',
    data: { userId: userId, dpId: dpId }
  })
}

export function changeStatus(userId, status) {
  return request({
    url: '/department/changeStatus',
    method: 'post',
    data: { userId: userId, status: status }
  })
}

export function deleUsers(userId) {
  return request({
    url: '/department/deleUsers',
    method: 'post',
    data: { userId: userId }
  })
}

export function updateUsers(userId, userInfo) {
  return request({
    url: '/department/updateUsers',
    method: 'post',
    data: { userId: userId, userInfo }
  })
}

export function addNewUsers(userInfo) {
  return request({
    url: '/department/addNewUsers',
    method: 'post',
    data: { userInfo: userInfo }
  })
}

// depparmentId为空说明新建了根节点同级组织
export function appendDepChild(departmentId, departmentInfo) {
  return request({
    url: '/department/appendDepChild',
    method: 'post',
    data: { departmentId: departmentId, departmentInfo: departmentInfo }
  })
}

export function deleDepartment(departmentId) {
  return request({
    url: '/department/deleDepartment',
    method: 'post',
    data: { departmentId: departmentId }
  })
}

export function getSearchedLength(stringInfo) {
  return request({
    url: '/department/getSearchedLength',
    method: 'post',
    data: { stringInfo: stringInfo }
  })
}
