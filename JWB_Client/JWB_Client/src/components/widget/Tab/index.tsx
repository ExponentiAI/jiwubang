import Taro from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import Component from '../../common/component';
import './index.scss';
import { infoRIco, infoPIco } from '../../../assets/images/icon'
import { login } from '../../../models/home'
import {getGlobalData, setGlobalData} from "global"




// eslint-disable-next-line

const { regeneratorRuntime } = global;
var pageToSwicth = 0;

interface Props {
  className?: string;
  style?: string;
}

interface State {
  active: number;
}

class Tab extends Component<Props, State> {
  constructor() {
    super()
    this.state = {
      active: 0
    }
  }

  prefix = 'w-tab'
  tabList = [
    { text: '信息求助', jump: 0, icon: infoRIco, selectedIcon: infoRIco },
    { text: '信息提供', jump: 1,  icon: infoPIco, selectedIcon: infoPIco }
  ]

  async login() {
    let data = await login({ u_type: '', openid: '', nick_name:'', avatar_url:'' , gender:'' })
    if(data && pageToSwicth==1) {    
      Taro.navigateTo({url: '/pages/demand/index'})
    }
    if(data && pageToSwicth==0) {    
      Taro.navigateTo({url: '/pages/help/index'})
    }
  }

  

  onGetUserInfo(item, e) {
      setGlobalData('userinfo',e.detail.userInfo)
      console.log(e.detail.userInfo)
    if( e.detail.userInfo) {
      pageToSwicth = item.jump
      this.login()
    }
  }

 

  render() {
    const { style, className = '' } = this.props
    const { active } = this.state

    return <View style={style} className={`${className} ${this.prefix}`}>
      {
        this.tabList && this.tabList.map((item, idx) => (
          <Button openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this, item)} key={item.text} className={`${this.prefix}-btn ${idx === active ? `${this.prefix}-btn-selected` : ''}`} hoverClass={`${this.prefix}-btn-hc`}>
            {idx !== active && <Image className={`${this.prefix}-btn-icon`} src={item.icon}></Image>}
            {idx === active && <Image className={`${this.prefix}-btn-icon`} src={item.selectedIcon}></Image>}
            {item.text}
          </Button>
        ))
      }
    </View>
  }
}

export default Tab;
