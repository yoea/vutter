import request from '@/utils/request'

export function getRolesList() {
  return request({
    url: '/roles/list',
    method: 'get'
  })
}

