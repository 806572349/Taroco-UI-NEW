import request from '@/plugin/axios'

export function list (query) {
  return request({
    url: '/admin/bizgoodsspecificationdict/page',
    method: 'get',
    params: query
  })
}
