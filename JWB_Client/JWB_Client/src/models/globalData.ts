import { getStorageSync } from "@tarojs/taro"
   
  const globalData = {
    userinfo:{avatarUrl: "",
    city: "",
    country: "",
    gender: 1,
    language: "0",
    nickName: "",
    province: "",},
    latitude: 0,
    longitude: 0,
    address: [],
  }
  var logininfo = {
     u_type: 0,
     openid: '',
     nick_name: "",
     avatar_url: "",
     gender: "",
  }
  export function setGlobalData (key, val) {
    globalData[key] = val
  }
  export function getGlobalData (key) {
    return globalData[key]
  }
  export function getLogininfo () {
    if(getStorageSync('logininfo')['openid']){
    logininfo['openid'] = getStorageSync('logininfo')['openid']}
    logininfo['nick_name'] = globalData['userinfo']['nickName']
    logininfo['avatar_url'] = globalData['userinfo']['avatarUrl']
    if(globalData['userinfo']['gender']==1){
        logininfo['gender'] = '男'
    } else if(globalData['userinfo']['gender']==2){
        logininfo['gender'] = '女'
    }
    return logininfo
  }
  export function setLogininfo () {
    if(getStorageSync('logininfo')['openid']){
    logininfo['openid'] = getStorageSync('logininfo')['openid']}
    logininfo['nick_name'] = globalData['userinfo']['nickName']
    logininfo['avatar_url'] = globalData['userinfo']['avatarUrl']
    if(globalData['userinfo']['gender']==1){
        logininfo['gender'] = '男'
    } else if(globalData['userinfo']['gender']==2){
        logininfo['gender'] = '女'
    }
    
  }