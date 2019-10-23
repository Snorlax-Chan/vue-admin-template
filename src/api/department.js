import request from '@/utils/request'

export function getAlldep() {
  return request({
    url: '/showDep/Alldep',
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
