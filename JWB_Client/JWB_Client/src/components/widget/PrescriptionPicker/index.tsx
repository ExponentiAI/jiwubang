import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'

import './index.scss';

class PrescriptionPicker extends Component {
  state = {
    selector: ['1天', '3天', '7天', '10天'],
    selectorValue: [1, 3, 7, 10],
    selectorChecked: '3天',
  }
onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
    this.props.handleValue(this.state.selectorValue[e.target.value])
  }
render () {
    return (
      <View className='container'>
        <View className='page-body'>
          <View className='page-section'>
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='picker'>
                  <View className="picker-left">发布时效</View>
                  <View className="picker-right">{this.state.selectorChecked}</View>
                </View>
              </Picker>
            </View>
          </View>
        </View>
      </View>
    )
  }
}