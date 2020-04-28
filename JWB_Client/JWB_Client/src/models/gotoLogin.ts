import Taro from '@tarojs/taro';


export function gotologin(){
    //清除缓存
    Taro.clearStorageSync()
    // 登录
    Taro.login({
      success: res => {
        // 发送 res.code 到后台换取 openid
        //console.log(res.code)
        if (res.code) {
          //发起网络请求
          Taro.request({
            url: 'http://129.204.190.240:7760/UserLogin?js_code='+res.code,
            // url: 'http://121.43.233.66:8009/UserLogin?js_code='+res.code,
            method:'GET',
            
            success: res => {
              let mylogininfo = res.data
               //console.log(mylogininfo)
              
              if (mylogininfo) {
                Taro.setStorageSync('logininfo', mylogininfo)
      }
    }
  })
 }
 }
})
}