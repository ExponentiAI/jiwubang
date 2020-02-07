import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Canvas, Navigator, Button, Map } from '@tarojs/components'
import { UPage } from '../../components/ui'
import { WTab, WMessageItem } from '../../components/widget'
import './index.scss'
import { AtIcon } from 'taro-ui'
import { scrollUpIco } from '../../assets/images/icon'
import {getGlobalData, setGlobalData, getLogininfo} from "../../models/globalData"


export default class About extends Component {
  config: Config = {
    navigationBarTitleText: '关于我们'
  }

  render () {
    return (
      // <View className='mainPanel'>
      <View className='at-col'>
        {/* <View className='at-icon at-icon-sketch' size={40}></View> */}
        <View className='at-row at-row__justify--center'>
          <AtIcon value='sketch' size='40' color='#F00'></AtIcon>
        </View>
        <View className='at-row at-row__justify--center'>
          <Text className='about_text'>关于</Text>
        </View>
        <View className='maintext-box'>
          <View className='maintext'>
            所有数据均来源于官方渠道。任何谣言或未经官方确定一律屏蔽。
          </View>
          <View className='maintext'>
            如有提供数据来源、地址位置错误、反馈改进，请填写意见反馈，这是反馈唯一快速通道
          </View>
          <View className='maintext'>
            声明：来自全国各地的志愿者、根据官方发布的信息进行整理。整理数据的位置存在一定偏移，一切以官方为准。
          </View>
        </View>
      </View>
      
      
    )
  }
}