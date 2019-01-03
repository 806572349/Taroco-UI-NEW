import request from '@/plugin/axios'

export function list (query) {
  return request({
    url: '/admin/bizgoodsspecificationdict/page',
    method: 'get',
    params: query
  })
}

export function update (query) {
  return request({
    url: '/admin/bizgoodsspecificationdict/up',
    method: 'post',
    data: query
  })
}
