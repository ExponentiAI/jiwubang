import FetchMock from 'fetch-mock';
import api from '../src/api/api'
/**相关文档请参考
 * http://www.wheresrhys.co.uk/fetch-mock/
 * http://mockjs.com/
 */
const options = {
  delay: 1000
}
export default {
  init () {
    console.log('===========mock init===========')
    FetchMock.post(api.loginSms, {
      data: null,
      success: true,
      message: '验证码发送成功'
    }, options)

    FetchMock.post(api.login, (_, request) => {
      console.log(request)
      return {
        data: null,
        success: true,
        message: '登录成功'
      }
    }, options)

  }
}