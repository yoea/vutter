import request from '@/utils/request'

export function count() {
  return request({
    url: '/book/count',
    method: 'post'
  })
}

export function deleteBook(params) {
  return request({
    url: '/book/delete',
    method: 'delete',
    params
  })
}

export function getOne(params) {
  return request({
    url: '/book/get',
    method: 'get',
    params
  })
}

export function listBook(data) {
  return request({
    url: '/book/list',
    method: 'post',
    data
  })
}

export function updateOrSave(data) {
  return request({
    url: '/book/put',
    method: 'put',
    data
  })
}
