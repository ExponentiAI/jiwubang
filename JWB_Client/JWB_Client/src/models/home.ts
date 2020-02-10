import Taro from '@tarojs/taro';
import {getGlobalData} from "../models/globalData"

export const login = ( userdata:{ u_type: number; openid: string; nick_name: string; avatar_url: string; gender: string }) => Taro.request({
  method: 'POST',
  url: 'https://jwb.comdesignlab.com/UserRegister/',
  // url: 'http://121.43.233.66:8009/UserRegister/',
  data: JSON.stringify({
    u_type: userdata.u_type,
    open_id: userdata.openid,
    nick_name: encodeURIComponent(userdata.nick_name),
    avatar_url: userdata.avatar_url,
    gender: userdata.gender,
    nation: getGlobalData('address')['nation'],
    province: getGlobalData('address')['province'],
    city: getGlobalData('address')['city'],
    district: getGlobalData('address')['district'],
    street: getGlobalData('address')['street'],
    street_number: getGlobalData('address')['street_number'],
    store_name: '口罩',
    m_longitude: getGlobalData('latitude'),
    m_latitude: getGlobalData('longitude'),
}),
  success: res => {
   let mdata = res.data
  //  console.log(mdata.msg)
    if(mdata.msg){
    // 储存返回的用户状态（新/旧）
    Taro.setStorageSync(
      'login_status',
      mdata.msg
    )
    } else if(!mdata.msg) {
      Taro.showToast({
        title: '失败',
        icon: 'none',
        duration: 2000
      })

    }
  }
})