import request from '@/plugin/axios'

export function list (query) {
  return request({
    url: '/admin/bizgoods/page',
    method: 'get',
    params: query
  })
}

export function update (query) {
  return request({
    url: '/admin/bizgoods/up',
    method: 'post',
    data: query
  })
}

export function add (query) {
  return request({
    url: '/admin/bizgoods/add',
    method: 'post',
    data: query
  })
}
