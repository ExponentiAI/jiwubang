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
  itemData?: {
    avatar_url?: string;
    details_info?: Array<any>;
    s_aging?: number;
    s_city?: string;
    s_content?: string;
    s_lat?: number;
    s_lon?: number;
    s_nation?: string;
    s_province?: string;
    s_range?: number;
    s_street: string;
    s_street_number?: string;
    s_subtime: string;
    s_type?: number;
    store_name?: string;
  };
}

// {
//   avatar_url?: string;
//   details_info?: Array<any>;
//   s_aging?: number;
//   s_city?: string;
//   s_content?: string;
//   s_lat?: number;
//   s_lon?: number;
//   s_nation?: string;
//   s_province?: string;
//   s_range?: number;
//   s_street: string;
//   s_street_number?: string;
//   s_subtime: string;
//   s_type?: number;
//   store_name?: string;
// }

// [{
//   avatar_url: "1",
//   details_info: [],
//   s_aging: 1,
//   s_city: "汕头市",
//   s_content: "",
//   s_lat: 23.46613,
//   s_lon: 116.75608,
//   s_nation: "中国",
//   s_province: "广东省",
//   s_range: 1,
//   s_street: "文冠路",
//   s_street_number: "文冠路",
//   s_subtime: "1580913183920",
//   s_type: 0,
//   store_name: "",
// }]

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
    if (this.props.itemData){
      if(this.props.itemData.details_info){
        for (item in this.props.itemData.details_info){
          goodsInfo.push(this.props.itemData.details_info[item])
        }
      }

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
}

export default Tab;
