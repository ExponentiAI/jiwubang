import Taro from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import Component from '../../common/component';
import './index.scss';
import { billIco1, billIco2, reportIco1, reportIco2 } from '../../../assets/images/icon'

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
    { text: '信息求助', jump: false, icon: billIco1, selectedIcon: billIco2 },
    { text: '信息提供', jump: true,  icon: reportIco1, selectedIcon: reportIco2 }
  ]

  onGetUserInfo(item, e) {
    console.log(e.detail.userInfo)
    if(item.jump) {
      Taro.navigateTo({url: '/pages/demand/index'})
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
