import Taro from '@tarojs/taro'
import config from '../config/config'
import qs from 'qs'

const dev = process.env.NODE_ENV === 'development'

class Http {
  BASEURL:String
  private static instance: Http;

  public constructor () {
    this.BASEURL = config.baseUrl
  }

  public static getInstance(): Http {
    if (!this.instance) {
        this.instance = new Http();
    }
    return this.instance;
  }

  request(options: {api: string, data?: object, showLoading?: boolean, method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'}) {
    const { api, showLoading = false, data, method = 'GET' } = options
    
    if(showLoading){
      Taro.showLoading({
        title: 'Loading...'
      })
    }
    return new Promise((resolve, reject) => {
      Taro.request({
        url: `${this.BASEURL + api}`,
        method,
        data: JSON.stringify(data),
        credentials: 'include',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }).then((res:any) => {
        showLoading && Taro.hideLoading()
        resolve(res.data)
        if (!res.data.success) {
          Taro.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 3000
          })
        }
      })
    })
  }

}
let http = Http.getInstance()
export default http;

