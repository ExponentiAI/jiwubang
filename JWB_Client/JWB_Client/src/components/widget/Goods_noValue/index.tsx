
import Taro from '@tarojs/taro';
import { View, Checkbox, Input, CheckboxGroup,Text } from '@tarojs/components';
import './index.scss';
import Component from '../../common/component'

interface Props {
  id?: number;
  value?: string;
  label?: string;
  text?:string;
  checked?: boolean;
  handleValue?(event): void;
  type: number;
};

interface State {
  isShow: boolean;
  checked: boolean;
}

export default class WGoods_noValue extends Component<Props> {  

    state: State

    constructor() {
      super(...arguments)
      this.state = {
        isShow: false,
        checked: false,
      }
    }

    componentDidMount() {

    }

    

    render () {
      return (
        <View className="goodsbox">
            <CheckboxGroup onChange={this.onChange.bind(this)}>
              <Checkbox className='goods-left' value={String(this.props.value)}> {this.props.label} </Checkbox>
            </CheckboxGroup>
            <View className='goods-right'>
              {
                this.state.isShow && <Text className='input'>{this.props.text}</Text>}
              
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
          
        })
      }else{
        this.props.handleValue({
          checked: true,
          index: this.props.value,
        })
      }
    }
  } 