
import Taro from '@tarojs/taro';
import { View, Checkbox, Input, CheckboxGroup } from '@tarojs/components';
import './index.scss';
import Component from '../../common/component'

interface Props {
  id?: number;
  value?: string;
  label?: string;
  unit?: string;
  checked?: boolean;
  handleValue?(event): void;
  type: number;
};

interface State {
  isShow: boolean;
  checked: boolean;
  goodsValue: string;
}

export default class WGoods extends Component<Props> {  

    state: State

    constructor() {
      super(...arguments)
      this.state = {
        isShow: false,
        checked: false,
        goodsValue: '',
      }
    }

    componentDidMount() {

    }

    onClick = e =>{
      if(e.target.value == ''){
        this.props.handleValue({
          checked: true,
          index: this.props.value,
          value: -1,
        })
      }else{
        this.props.handleValue({
          checked: true,
          index: this.props.value,
          value: e.target.value,
        })
      }
    }

    render () {
      return (
        <View className="goodsbox">
            <CheckboxGroup onChange={this.onChange.bind(this)}>
              <Checkbox className='goods-left' value={String(this.props.value)}> {this.props.label} </Checkbox>
            </CheckboxGroup>
            <View className='goods-right'>
              {
                this.state.isShow && <Input name='number' type={this.props.type==1?'number':'digit'} value = ''
                placeholder='请输入' className='input' onInput={this.onClick.bind(this)}
                // onInput={(e) => {this.setState({goodsValue: e.target.value})}}
              />}
              {this.state.isShow && <View>{this.props.unit}</View>}
            </View>
        </View>
      )
    }

    onChange = e =>{
      this.setState({isShow: !!e.detail.value[0]})
      if(this.state.isShow){
        this.props.handleValue({
          checked: false,
          index: this.props.value,
          value: this.state.goodsValue,
        })
      }else{
        this.props.handleValue({
          checked: true,
          index: this.props.value,
          value: -1,
        })
      }
    }
  } 