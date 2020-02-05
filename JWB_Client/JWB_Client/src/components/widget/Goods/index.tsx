// import Taro from '@tarojs/taro';
// import { View, Checkbox, Input, CheckboxGroup } from '@tarojs/components';
// import './index.scss';
// import Component from '../../common/component'

// interface Props {
//   id?: number;
//   value?: string;
//   label?: string;
//   unit?: string;
// };

// interface State {
//   isShow: boolean;
// }

// export default class WGoods extends Component<Props> {  

//     state: State

//     constructor() {
//       super(...arguments)
//       this.state = {
//         isShow: false,
//       }
//     }

//     componentDidMount() {
//       // console.log(this.props)
//     }

//     render () {
//       return (
//         <View className="goodsbox">
//             <CheckboxGroup onChange={this.onChange.bind(this)}>
//               <Checkbox className='goods-left' value={String(this.props.value)}> {this.props.label} </Checkbox>
//             </CheckboxGroup>
//             <View className='goods-right'>
//               {this.state.isShow && <Input name='number' type='number' placeholder='' className='input' onClick={() => {}}/>}
//               {this.state.isShow && <View>{this.props.unit}</View>}
//             </View>
//         </View>
//       )
//     }

//     onChange = e =>{
//       this.setState({isShow: !!e.detail.value[0]})
//     }
//   } 


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
};

interface State {
  isShow: boolean;
  checked: boolean;
  goodsValue: number;
}

export default class WGoods extends Component<Props> {  

    state: State

    constructor() {
      super(...arguments)
      this.state = {
        isShow: false,
        checked: false,
        goodsValue: -1,
      }
    }

    componentDidMount() {

    }

    onClick = e =>{
      // this.setState({
      //   goodsValue: e.target.value
      // });
      if(e.target.value == ''){
        this.props.handleValue({
          checked: true,
          index: this.props.value,
          value: -1,
        })
      }
      this.props.handleValue({
        checked: true,
        index: this.props.value,
        value: this.state.goodsValue,
      })
    }

    render () {
      return (
        <View className="goodsbox">
            <CheckboxGroup onChange={this.onChange.bind(this)}>
              <Checkbox className='goods-left' value={String(this.props.value)}> {this.props.label} </Checkbox>
            </CheckboxGroup>
            <View className='goods-right'>
              {this.state.isShow && <Input name='number' type='number' value = ''
                placeholder='请输入' className='input' onBlur={this.onClick.bind(this)}
                onInput={(e) => {this.setState({goodsValue: e.target.value})}}/>}
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