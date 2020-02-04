import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'

import './index.scss';

class LocationPicker extends Component {
  state = {
    selector: ['1km内', '3km内', '7km内', '10km内'],
    selectorChecked: '1km内',
  }
onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

render () {
    return (
      <View className='container'>
        <View className='page-body'>
          <View className='page-section'>
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='picker'>
                  <View className="picker-left">位置范围</View>
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