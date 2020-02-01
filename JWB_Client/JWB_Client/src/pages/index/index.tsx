import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image,Navigator,Button} from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import source  from '../../libs/source'
import './index.less'
import http from '../../libs/http'
import api from '../../api/api'

let isWapp = process.env.TARO_ENV;


export interface State{
  open: boolean,
  homeData: any,
}
export default class Index extends Component {
  state:State
  config: Config = {
    navigationBarTitleText: '信息求助'
  }
  constructor(props){
    super(props)
    this.state = {
      open: !false,
      homeData: {}
    }
  }

  componentWillMount () {
    Taro.showShareMenu()
      .then(
        ()=>{
          this.onShareAppMessage
        }
      )
  }
  onShareAppMessage(res){
    // 这是分享配置
    return {
      title: '老板记账  收支更清晰',
      path: '/pages/index/index',
      imageUrl: source.shareImage,
    }
  }
  componentDidMount () { }
  componentWillUnmount () { }
  componentDidShow () { }
  componentDidHide () { }

  homeInfo(){
    // 网络http请求示例
    http.request(api.getUser)
      .then((res:any)=>{
        if(res.success){
          this.setState({
          },()=>{
            // ...
          })
        }
      })
  }
  render () {
    return (
      <View className='index'>
        首页
        {
          isWapp === 'weapp'?
          <AtModal isOpened={this.state.open} closeOnClickOverlay={false}>
            <AtModalContent>
            为了您更好的体验小程序，建议您授权微信获取用户信息
            </AtModalContent>
            <AtModalAction>
              <Button className='button-gray' onClick={ () => {
                this.setState({
                  open: false
                })
              } }>取消</Button>
              <Button openType='getUserInfo' onGetUserInfo={ () => {
                this.setState({
                  open: false
                })
              } }>获取授权</Button>
            </AtModalAction>
          </AtModal>:''
        }

      </View>
    )
  }
}