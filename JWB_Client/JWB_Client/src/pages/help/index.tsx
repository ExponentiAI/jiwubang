import Taro, { Component, Config } from '@tarojs/taro'
import { View, Checkbox, Text, Map } from '@tarojs/components'
import { UPage } from '../../components/ui'
import { AtButton, AtAccordion, AtTextarea, AtCheckbox } from 'taro-ui'
import './index.scss'

export interface State {
  showMyAccordion: boolean;
  showShopAccordion: boolean;
  checkedList: Array<any>;
}

export default class Index extends Component {
  state: State
  config: Config = {
    navigationBarTitleText: '信息求助'
  }


  constructor() {
    super(...arguments)
    this.state = {
      showMyAccordion: false,
      showShopAccordion: true,
      checkedList: []
    }
  }

  checkboxOption = [{
    value: '1',
    label: '外科用口罩',
  }, {
    value: '2',
    label: 'N95口罩'
  }, {
    value: '3',
    label: '一次性普遍口罩'
  }]

  render() {
    const { showMyAccordion, showShopAccordion, checkedList} = this.state

    return (
      <UPage
        className='p-help-page'
        showBottom
        titleImmerse
        renderBottom={
          <View className='p-bottom-wrap g-safe-area'>
            <Checkbox className='p-clause'>我已阅读</Checkbox>
            <Text className='p-text'>《xxxx》</Text>
            <View className='p-submit'>
              <AtButton className='p-submit-btn' type='primary' circle size='small' customStyle={{ width: '60%' }}>提交</AtButton>
            </View>
          </View>
        }
      >
        <AtAccordion
          open={showMyAccordion}
          onClick={(val) => this.setState({ showMyAccordion: val })}
          title='我的位置'
        >
          <Map
            // onClick={this.mapClick.bind(this)}
            className='p-map'
          />
        </AtAccordion>

        <AtAccordion
          open={showShopAccordion}
          onClick={(val) => this.setState({ showShopAccordion: val })}
          title='商店所在位置'
        >
          <Map
            // onClick={this.mapClick.bind(this)}
            className='p-map'
          />
        </AtAccordion>

        <AtTextarea
          customStyle={{ borderTop: 'none', borderRadius: 0 }}
          value=''
          onChange={() => { }}
          maxLength={200}
          placeholder='描述你的需求信息...'
        />

        <View>
          <View className='g-panel-title'>需求物品</View>
          
          <AtCheckbox onChange={(val) => this.setState({checkedList: val})} options={this.checkboxOption} selectedList={checkedList}>
          </AtCheckbox>
        </View>

      </UPage>
    )
  }
}
