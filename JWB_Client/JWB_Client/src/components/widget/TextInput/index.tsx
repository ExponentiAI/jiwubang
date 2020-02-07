import Taro from '@tarojs/taro';
import { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

import './index.scss';

interface Props {
  value?: string;
  label?: string;
  handleValue?(event): void;
};

class TextInput extends Component<Props> {
  constructor(props) {
    super(props);
  }

  onBlur = e => {
    this.props.handleValue(e.detail.value)
  }

  render(){
    return(
      <View className='container'>
        <View className='page-body'>
          <View className='page-section'>
            <View className='picker'>
              <View className="picker-left">{this.props.label}</View>
              <Input name='number' type='number' value = ''
                placeholder={this.props.value} className='input'
                onInput={this.onBlur.bind(this)}/>                
            </View>
          </View>
        </View>
      </View>
    )
  }
}
