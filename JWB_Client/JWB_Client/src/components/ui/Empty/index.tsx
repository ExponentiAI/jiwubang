import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import Component from '../../common/component';
import './index.scss';
import { empty } from '../../../assets/images/icon'

interface Props {
  className?: string;
  style?: string;
  text?: string;
}

class Empty extends Component<Props> {
  prefix = 'u-empty'

  render() {
    const { text } = this.props;

    return <View style={this.props.style} className={`this.props.className ${this.prefix}`}>
      <Image className={`${this.prefix}-img`} src={empty}></Image>
      <View>{text ? text : '暂无数据'}</View>
    </View>
  }
}

export default Empty;
