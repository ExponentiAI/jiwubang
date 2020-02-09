import Taro from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import Component from '../../common/component';
import './index.scss';
import { infoRIco, infoPIco } from '../../../assets/images/icon'
import { login } from '../../../models/home'
import {getGlobalData, setGlobalData, getLogininfo} from "../../../models/globalData"


// eslint-disable-next-line

const { regeneratorRuntime } = global;
var pageToSwicth = 0;

interface Props {
  className?: string;
  style?: string;
  latitude?: number;
  longitude?: number;
  address?: any;
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
    { text: '信息提供', jump: 1, icon: infoPIco, selectedIcon: infoPIco },
    { text: '关于我们', jump: 2, icon: infoPIco, selected: infoPIco},
  ]

  async login() {
    let data
    if(!data&&pageToSwicth!=2)
      data = await login(getLogininfo())
    if (data && pageToSwicth == 1) {
      // Taro.navigateTo({ url: `/pages/demand/index?latitude=${this.props.latitude}&longitude=${this.props.longitude}&address=${JSON.stringify(this.props.address)}` })
      Taro.redirectTo({ url: `/pages/demand/index` })
    }
    if (data && pageToSwicth == 0) {
      // Taro.navigateTo({ url: `/pages/help/index?latitude=${this.props.latitude}&longitude=${this.props.longitude}&address=${JSON.stringify(this.props.address)}` })
      Taro.redirectTo({ url: `/pages/help/index` })
    }
    if (pageToSwicth == 2){
      Taro.redirectTo({ url: `/pages/about/index` })
    }
  }



  onGetUserInfo(item, e) {
      
    if (e.detail.userInfo) {
      setGlobalData('userinfo',e.detail.userInfo)
      // console.log(getLogininfo())

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
          // <Button openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this, item)} key={item.text} className={`${this.prefix}-btn ${idx === active ? `${this.prefix}-btn-selected` : ''}`} hoverClass={`${this.prefix}-btn-hc`}>
          <Button openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this, item)} key={item.text} className={`${this.prefix}-btn`} hoverClass={`${this.prefix}-btn-hc`}>
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
