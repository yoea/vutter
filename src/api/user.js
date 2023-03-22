import request from '@/utils/request'

export function deleteBatchByIds(ids) {
  return request({
    url: '/user/delete/ids=' + ids,
    method: 'post'
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}

export function userRegister(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function deleteById(params) {
  return request({
    url: '/user/delete',
    method: 'get',
    params
  })
}

export function listUser(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function deleteUser(params) {
  return request({
    url: '/user/delete',
    method: 'delete',
    params
  })
}

export function getOne(params) {
  return request({
    url: '/user/one',
    method: 'get',
    params
  })
}

export function updateOrSave(data) {
  return request({
    url: '/user/put',
    method: 'put',
    data
  })
}
