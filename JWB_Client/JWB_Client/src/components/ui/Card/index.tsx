import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import Component from '../../common/component';
import './index.scss';

interface Props {
  className?: string;
  style?: string;
}

class Card extends Component<Props> {
  render() {
    return <View style={this.props.style} className={this.props.className + ' u-card'}>
      {this.props.children}
    </View>
  }
}

export default Card;
