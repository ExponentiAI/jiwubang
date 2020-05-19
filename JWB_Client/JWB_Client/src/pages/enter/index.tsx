import Taro, { Component, Config, base64ToArrayBuffer  } from '@tarojs/taro'
import { View, Text, Image, Navigator, WebView,Button  } from '@tarojs/components'
import './index.scss'
import { AtIcon } from 'taro-ui'
import { login } from '../../models/home'
import {getGlobalData, setGlobalData, getLogininfo} from "../../models/globalData"
import {enterPageBG,lifeIcon,medicalIcon } from '../../assets/images/icon'

var pageToSwitch = 0;
export interface state {
    active: number;
  }

export default class About extends Component {
  config: Config = {
    navigationBarTitleText: '类别选择'
  }
  constructor() {
    super()
    this.state = {
      active: 0,
    }
  }

  async login() {
    let data
    if(!data){
      // console.log('test', getLogininfo())
      // console.log('test', decodeURIComponent(encodeURIComponent(getLogininfo().nick_name)))
      data = await login(getLogininfo())
    } 
    if (data && pageToSwitch == 0) {
      // Taro.navigateTo({ url: `/pages/demand/index?latitude=${this.props.latitude}&longitude=${this.props.longitude}&address=${JSON.stringify(this.props.address)}` })
      Taro.redirectTo({ url: `/pages/home/index` })
    }
    if (data && pageToSwitch == 1) {
      // Taro.navigateTo({ url: `/pages/help/index?latitude=${this.props.latitude}&longitude=${this.props.longitude}&address=${JSON.stringify(this.props.address)}` })
      Taro.redirectTo({ url: `/pages/home_life/index` })
    }
  }

  onGetUserInfo(item,e) {
    if (e.detail.userInfo) {
      setGlobalData('userinfo',e.detail.userInfo)
      pageToSwitch=item
    }
    if(item == 0 || item == 1){
      this.login()
    }else if(item.jump == 2){
      Taro.redirectTo({ url: `/pages/about/index` })
    }
  }

  onClick(){
    Taro.redirectTo({ url: `/pages/about/index` })
  }


  render () {
    return (
     
      <View className='body'>
           <Image
              className='background'
              src={enterPageBG}
            />   
            <Button className='button' id='medical' openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this,0)}  >
              <Image className='button-icon' src={medicalIcon} />
              <text className='button-text'>应急物资</text>
              
            </Button> 
            <Button className='button' id='life' openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this,1)}  >
              <Image className='button-icon' src={lifeIcon} />
              <text className='button-text'>生活服务</text>
            </Button> 
            <View className='about'>
            <Text onClick={this.onClick.bind(this)}>关于我们</Text>
            </View>
      </View>
    )
  }
}