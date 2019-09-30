import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getIdentify() {
  return request({
    url: '/user/identify',
    method: 'get'
  })
}

export function getRouter(roles) {
  return request({
    url: '/user/router',
    method: 'post',
    data: roles
  })
}

export function getRoleName() {
  return request({
    url: '/user/roleName',
    method: 'get'
  })
}

export function getAllUser() {
  return request({
    url: '/allUser',
    method: 'get'
  })
}
