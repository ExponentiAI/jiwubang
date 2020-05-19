import Taro, { Component, Config, base64ToArrayBuffer, navigateBackMiniProgram  } from '@tarojs/taro'
import { View, Text, Image, Navigator, WebView  } from '@tarojs/components'
import './index.scss'
import { AtIcon } from 'taro-ui'
import { aboutIcon, disco, bottomIcon,huaqiaoIcon,shejiyuanIcon,nsfcIcon,exponentiAIIcon,tengxun } from '../../assets/images/icon'


export default class About extends Component {
  config: Config = {
    navigationBarTitleText: '关于我们',
    
  }


  render () {
    return (
      <View className='at-col'>
        <View className='at-row at-row__justify--center'>
          <Image
            style='width: 120rpx; height: 120rpx; background: #fff;'
            src={aboutIcon}
          />
        </View>
        <View className='at-row at-row__justify--center'>
          <Text className='about_text'>关于我们</Text>
        </View>
        <View className='subtitle-box'>
          <View className='at-row at-row__justify--center'>
            <Text className='subtitle'>研发团队</Text>
          </View>
          <View className='at-row at-row__justify--center'>
            <Image
              style='width: 200px; height: 70px; background: #fff;'
              src={exponentiAIIcon}
            />
          </View>
          <View className='at-row at-row__justify--center'>
            <Text className='mainlab' style='color: grey ;letter-spacing:3px'>指能创新学科交叉研究中心</Text>
          </View>
          
        </View>
        <View className='subtitle-box'>
          <View className='at-row at-row__justify--center'>
            <Text className='subtitle'>联系方式</Text>
          </View>

          <View className='at-row at-row__justify--center'>
            <Text className='mainlab'>技术支持：taotaomails@gmail.com</Text>
          </View>
          <View className='at-row at-row__justify--center'>
            <Text className='mainlab'>公益支援：whoing@hnu.edu.cn</Text>
          </View>
        </View>
        <View className='subtitle-box'>
          <View className='at-row at-row__justify--center'>
            <Text className='subtitle'>Github开源地址</Text>
          </View>

          <View className='at-row at-row__justify--center'>
            <Text className='mainlab'>https://github.com/ExponentiAI/jiwubang/</Text>
          </View>
        </View>
        <View className='subtitle-box'>
          <View className='at-row at-row__justify--center'>
            <Text className='subtitle'>合作机构</Text>
          </View>
          <View className='at-row at-row__justify--center' style='display:flex;flex-direction:row'>
            <Image
              style='width: 55px; height: 35px; margin-right:10px;background: #fff;'
              src={shejiyuanIcon}
            />
            <Image
              style='width:42px; height: 35px; margin-right:10px;background: #fff;'
              src={huaqiaoIcon}
            />
             <Image
              style='width:60px; height: 35px; margin-right:10px;background: #fff;'
              src={disco}
            />
             <Image
              style='width:65px; height: 35px; margin-right:10px;background: #fff;'
              src={nsfcIcon}
            />
             <Image
              style='width:65px; height: 35px; background: #fff;'
              src={tengxun}
            />
          </View>
        </View>

      
      </View>
    )
  }
}