import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

export function getRoleAllEditPMS() {
  return request({
    url: `/roleAllEditPMS`,
    method: 'get'
  })
}

export function getRoleEditPMS(roles) {
  return request({
    url: `/EditRolePMS`,
    method: 'post',
    data: roles
  })
}

export function getdefaultRole() {
  return request({
    url: `/role/defaultRole`,
    method: 'get'
  })
}

export function updateRoutes(routesInfo) {
  return request({
    url: `/update/updateRoutes`,
    method: 'post',
    data: routesInfo
  })
}

export function addRoutes(routesInfo) {
  return request({
    url: `/add/addRoutes`,
    method: 'post',
    data: routesInfo
  })
}

export function addChildRoutes(routesInfo) {
  return request({
    url: `/add/addChildRoutes`,
    method: 'post',
    data: routesInfo
  })
}
