import Taro from '@tarojs/taro';
import { View, Checkbox, Input, CheckboxGroup } from '@tarojs/components';
import './index.scss';
import Component from '../../common/component'

interface Props {
  id?: number;
  value?: string;
  label?: string;
  unit?: string;
};

interface State {
  isShow: boolean;
}

export default class WGoods extends Component<Props> {  

    state: State

    constructor() {
      super(...arguments)
      this.state = {
        isShow: false,
      }
    }

    componentDidMount() {
      // console.log(this.props)
    }

    render () {
      return (
        <View className="goodsbox">
            <CheckboxGroup onChange={this.onChange.bind(this)}>
              <Checkbox className='goods-left' value={String(this.props.value)}> {this.props.label} </Checkbox>
            </CheckboxGroup>
            <View className='goods-right'>
              {this.state.isShow && <Input name='number' type='number' placeholder='' className='input' onClick={() => {}}/>}
              {this.state.isShow && <View>{this.props.unit}</View>}
            </View>
        </View>
      )
    }

    onChange = e =>{
      this.setState({isShow: !!e.detail.value[0]})
    }
  } 