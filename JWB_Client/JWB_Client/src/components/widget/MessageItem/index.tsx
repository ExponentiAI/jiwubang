import Taro from '@tarojs/taro';
import { View, Image, Button, Text, Input} from '@tarojs/components';
import Component from '../../common/component';
import './index.scss';
import { empty } from '../../../assets/images/icon'
import { AtList, AtListItem, AtAccordion, AtInput} from "taro-ui"


interface Props {
  className?: string;
  style?: string;
}

interface State {
  active: number;
}

class Tab extends Component<Props, State> {
  prefix = 'w-message-item'

  render() {
    const { style, className = '',  } = this.props

    return <View style={style} className={`${className} ${this.prefix}`}>
      <View className={`${this.prefix}-top-wrap`}>
        <Image src='https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3094462453,75056796&fm=26&gp=0.jpg' className={`${this.prefix}-img`}></Image>
        <View className={`${this.prefix}-title`}>
          神龙药房
          <View className={`${this.prefix}-time`}>14:35</View>
        </View>
        <View className={`${this.prefix}-area`}>
          铁西区五马路 2 km
        </View>
      </View>
      <View className={`${this.prefix}-bottom-wrap`}>
        今日购进100只n95，的浪费我我欧热舞肉IEuoifka金坷垃附近开了积分大路考无人诶UR温热我罚款链接


      </View>


    </View>
  }
}

export default Tab;
