import http from '../libs/http'

export const login = (data: { u_type: number; openid: number; nick_name: string; avatar_url: string; gender: string }) => http.request({
  api: 'Authentication',
  method: 'POST',
  data,
  showLoading: true
})

