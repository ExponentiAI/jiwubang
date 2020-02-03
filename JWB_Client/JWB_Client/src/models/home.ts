import http from '../libs/http'

export const login = (data: {u_type, openid, nick_name, avatar_url, gender}) => http.request({
  api: 'Authentication',
  method: 'POST',
  data,
  showLoading: true
})

