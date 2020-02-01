import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Navigator } from '@tarojs/components'
// import source  from '../../libs/source'
import http from '../../libs/http'
import api from '../../api/api'

import './my-perCenter.less'

export interface State {
  url: string,
  nickname: string,
  photoNo: string,
  place:string

}

export default class Index extends Component {
  state: State
  config: Config = {
    navigationBarTitleText: '信息提供'
  }
  constructor(){
    super(...arguments)
    this.state = {
      url: '',
      nickname: '',
      photoNo: '',
      place: '',
    }
  }

  componentWillMount () { }
  componentDidMount () { }
  componentWillUnmount () { }
  componentDidShow () { }
  componentDidHide () { }

  render () {
    return (
      <View className='perCenter'>
        信息提供页
      </View>
    )
  }
}
