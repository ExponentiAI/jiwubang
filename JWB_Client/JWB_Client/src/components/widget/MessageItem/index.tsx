import Taro from '@tarojs/taro';
import { View, Image, Button, Text } from '@tarojs/components';
import Component from '../../common/component';
import './index.scss';
// import { empty } from '../../../assets/images/icon'

interface Props {
  id?: number;
  className?: string;
  style?: string;
  distance: Array<any>;
  itemData?: any;
}

interface State {
  active: number;
}



class Tab extends Component<Props, State> {
  prefix = 'w-message-item'

  state: State

  constructor(props) {
    super(props)
  }

  render() {
    const { style, className = '' } = this.props

    const goodsInfo = []
    let item
    for (item in this.props.itemData.details_info){
      goodsInfo.push(this.props.itemData.details_info[item])
    }
    // console.log(goodsInfo)
    let goods_str = this.props.itemData.s_street

    if (this.props.itemData.s_type == 0){
      goods_str += '需 '
      for(item in goodsInfo){
        goods_str += goodsInfo[item].goods_name + goodsInfo[item].count + "个 " + (item == goodsInfo.length-1?'':',')
      }
      goods_str += '#' + this.props.itemData.s_content
    }else{
      goods_str += '有 '
      for(item in goodsInfo){
        goods_str += goodsInfo[item].goods_name + goodsInfo[item].count + "元/个 " + (item == goodsInfo.length-1?'':',')
      }
      goods_str += '#' + this.props.itemData.s_content
    }

    return <View style={style} className={`${className} ${this.prefix}`}>
      <View className={`${this.prefix}-top-wrap`}>
        {
          this.props.itemData.avatar_url == '' 
          ? <Image src='https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3094462453,75056796&fm=26&gp=0.jpg' className={`${this.prefix}-img`}></Image>
          : <Image src={this.props.itemData.avatar_url} className={`${this.prefix}-img`}></Image>
        }
        <View className={`${this.prefix}-title`}>
          {this.props.itemData.store_name}
          <View className={`${this.prefix}-time`}>
            {this.props.itemData.s_subtime}
          </View>
        </View>
        <View className={`${this.prefix}-area`}>
           {this.props.itemData.s_street_number} {this.props.distance.distance} km
        </View>
      </View>
      <View className={`${this.prefix}-bottom-wrap`}>
        {goods_str}
        <View className={`${this.prefix}-operation`}>
          <Text className={`${this.prefix}-comment`}>评论</Text>
        </View>
      </View>
    </View>
  }
}

export default Tab;
