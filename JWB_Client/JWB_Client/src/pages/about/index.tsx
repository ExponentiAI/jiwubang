import Taro, { Component, Config, base64ToArrayBuffer  } from '@tarojs/taro'
import { View, Text, Image, Navigator, WebView  } from '@tarojs/components'
import './index.scss'
import { AtIcon } from 'taro-ui'
import { aboutIcon, disco, bottomIcon } from '../../assets/images/icon'


export default class About extends Component {
  config: Config = {
    navigationBarTitleText: '关于我们'
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
          <Text className='about_text'>关于</Text>
        </View>
        <View className='subtitle-box'>
          <View className='at-row at-row__justify--center'>
            <Text className='subtitle'>研发团队</Text>
          </View>
          <View className='at-row at-row__justify--center'>
            <Image
              style='width: 300rpx; height: 48rpx; background: #fff;'
              src={disco}
            />
          </View>
          <View className='at-row at-row__justify--center'>
            <Text className='mainlab'>湖南大学数据智能与服务协同实验室</Text>
          </View>
          <View className='at-row at-row__justify--center'>
            <Text style='color: black;font-size: .7em;'>&</Text>
          </View>
          <View className='sublab-box'>
            <View className='sublab'>
              湖南大学嵌入式与网络计算湖南省重点实验室
            </View>
            <View className='sublab'>
              国防科技大学高性能计算国家重点实验室
            </View>
            <View className='sublab'>
              中山大学大数据与计算智能研究所
            </View>
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

        <View className='bottom-icon'>
            <Image
                style='width: 380rpx; height: 200rpx; background: #fff;'
                src={bottomIcon}
            />
        </View>
      </View>
    )
  }
}