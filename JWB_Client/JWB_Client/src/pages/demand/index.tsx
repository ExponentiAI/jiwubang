// import Taro, { Component, Config } from '@tarojs/taro'
// import { View, Checkbox, Text, Map } from '@tarojs/components'
// import { UPage } from '../../components/ui'
// import { AtButton, AtAccordion, AtTextarea, AtCheckbox } from 'taro-ui'
// import './index.scss'

// export interface State {
//   showMyAccordion: boolean;
//   showShopAccordion: boolean;
//   checkedList: Array<any>;
// }

// export default class Index extends Component {
//   state: State
//   config: Config = {
//     navigationBarTitleText: '信息提供'
//   }


//   constructor() {
//     super(...arguments)
//     this.state = {
//       showMyAccordion: false,
//       showShopAccordion: true,
//       checkedList: []
//     }
//   }

//   checkboxOption = [{
//     value: '1',
//     label: '外科用口罩',
//   }, {
//     value: '2',
//     label: 'N95口罩'
//   }, {
//     value: '3',
//     label: '一次性普遍口罩'
//   }]

//   render() {
//     const { showMyAccordion, showShopAccordion, checkedList} = this.state

//     return (
//       <UPage
//         className='p-demand-page'
//         showBottom
//         titleImmerse
//         renderBottom={
//           <View className='p-bottom-wrap g-safe-area'>
//             <Checkbox className='p-clause'>我已阅读</Checkbox>
//             <Text className='p-text'>《xxxx》</Text>
//             <View className='p-submit'>
//               <AtButton className='p-submit-btn' type='primary' circle size='small' customStyle={{ width: '60%' }}>提交</AtButton>
//             </View>
//           </View>
//         }
//       >
//         <AtAccordion
//           open={showMyAccordion}
//           onClick={(val) => this.setState({ showMyAccordion: val })}
//           title='我的位置'
//         >
//           <Map
//             // onClick={this.mapClick.bind(this)}
//             className='p-map'
//           />
//         </AtAccordion>

//         <AtAccordion
//           open={showShopAccordion}
//           onClick={(val) => this.setState({ showShopAccordion: val })}
//           title='商店所在位置'
//         >
//           <Map
//             // onClick={this.mapClick.bind(this)}
//             className='p-map'
//           />
//         </AtAccordion>

//         <AtTextarea
//           customStyle={{ borderTop: 'none', borderRadius: 0 }}
//           value=''
//           onChange={() => { }}
//           maxLength={200}
//           placeholder='描述你知道的信息...'
//         />

//         <View>
//           <View className='g-panel-title'>拥有物品</View>
          
//           <AtCheckbox onChange={(val) => this.setState({checkedList: val})} options={this.checkboxOption} selectedList={checkedList}>
//           </AtCheckbox>
//         </View>

//       </UPage>
//     )
//   }
// }


import Taro, { Component, Config } from '@tarojs/taro'
import { View, Checkbox, Text, Map, Progress, CheckboxGroup } from '@tarojs/components'
import { UPage } from '../../components/ui'
import { LocationPicker, PrescriptionPicker, WGoods } from '../../components/widget'
import {
  AtButton, AtAccordion, AtTextarea,
  AtModal, AtDivider 
} from 'taro-ui'

import './index.scss'

export interface State {
  showMyAccordion: boolean;
  showShopAccordion: boolean;
  showLocationRangeAccordion: boolean;
  showPrescriptionAccordion: boolean;
  checkboxOption: Array<any>;
  isOpened: boolean;
  isRead: boolean;
  value: string;
}

export default class Index extends Component {
  state: State
  config: Config = {
    navigationBarTitleText: '信息提供'
  }

  componentDidMount() {

  }

  constructor() {
    super(...arguments)
    this.state = {
      showMyAccordion: false,
      showShopAccordion: false,
      showLocationRangeAccordion: false,
      showPrescriptionAccordion: false,
      checkboxOption: [],
      isOpened: false,
      isRead: true,
      value: '',
    }
  }

  checkboxOption = [{
    id: 1,
    value: '1',
    label: '外科用口罩',
    unit: '只',
  }, {
    id: 2,
    value: '2',
    label: 'N95口罩',
    unit: '只',
  }, {
    id: 3,
    value: '3',
    label: '普通一次性口罩',
    unit: '只',
  }, {
    id: 4,
    value: '4',
    label: '医用酒精',
    unit: '瓶',
  }, {
    id: 5,
    value: '5',
    label: '84消毒液',
    unit: '瓶',
  }
  ]

  render() {
    const { showMyAccordion, showShopAccordion,
      isOpened, value } = this.state


    return (
      <UPage
        className='p-demand-page'
        showBottom
        titleImmerse
      // renderBottom={
      //   <View>
      //     <Progress className='p-progress' percent={25} strokeWidth={2} activeColor='#FFC82C'/>
      //     <View className='p-bottom-wrap g-safe-area'>
      //       <Checkbox className='p-clause' value='isRead'>我已阅读</Checkbox>
      //       <Text className='p-text' onClick={() => {this.setState({isOpened: true})}}>《使用守则》</Text>
      //       <View className='p-submit'>
      //         <AtButton className='p-submit-btn' type='primary' circle size='small' customStyle={{ width: '60%' }}>提交</AtButton>
      //       </View>
      //     </View>
      //   </View>  

      // }
      >
        <AtModal
          isOpened={isOpened}
          title='使用守则'
          confirmText='确认'
          onClose={() => { this.setState({ isOpened: false }) }}
          onConfirm={() => { this.setState({ isOpened: false }) }}
          content='欢迎使用急物帮'
        >
        </AtModal>

        <AtAccordion
          open={showMyAccordion}
          onClick={(val) => this.setState({ showMyAccordion: val })}
          title='用户绑定'
        >
          {/* <Map
            // onClick={this.mapClick.bind(this)}
            className='p-map'
          /> */}
        </AtAccordion>

        <AtAccordion
          open={showShopAccordion}
          onClick={(val) => this.setState({ showShopAccordion: val })}
          title='所需位置'
        >
          <Map
            // onClick={this.mapClick.bind(this)}
            className='p-map'
          />
        </AtAccordion>

        <AtTextarea
          customStyle={{ border: 'none', borderRadius: 0 }}
          value={value}
          onChange={(e) => {this.setState({value: e.detail.value})}}
          maxLength={100}
          placeholder='描述你的信息需求...'
        />

        <View className='divider'/>

        <View className='itemTitle'>
          所需物品
        </View>

        {/* <View>
          <View className='g-panel-title'>所需物品</View>
          <AtCheckbox onChange={(val) => this.setState({checkedList: val})} options={this.checkboxOption} selectedList={checkedList}>
          </AtCheckbox>
        </View> */}

        {/* {
          this.checkboxOption.map((option) => {
            return (
              <View className="goodsbox">
                <Checkbox className='goods-left' value={option.value}> {option.label} </Checkbox>
                <View className='goods-right'>
                  <Input name='number' type='number' placeholder='' className='input' onClick={() => { }} />
                  <View>只</View>
                </View>
              </View>
            )
          })
        } */}

        {
          this.checkboxOption.map((option) => {
            return (<WGoods
              id={option.id}
              key={option.id}
              value={option.value}
              label={option.label}
              unit={option.unit}
            ></WGoods>)
          })
        }

        <LocationPicker></LocationPicker>

        <PrescriptionPicker></PrescriptionPicker>

        <View>
          <Progress className='p-progress' percent={25} strokeWidth={2} activeColor='#FFC82C' />
          <View className='p-bottom-wrap g-safe-area'>
            <CheckboxGroup onChange={this.onChange.bind(this)}>
              <Checkbox className='p-clause' value='isRead'>我已阅读</Checkbox>
            </CheckboxGroup>
            <Text className='p-text' onClick={() => { this.setState({ isOpened: true }) }}>《用户发布守则》</Text>
            <View className='p-submit'>
              <AtButton className='p-submit-btn' type='primary' 
              circle size='small' customStyle={{ width: '60%' }}
              disabled={this.state.isRead}>提交</AtButton>
            </View>
          </View>
        </View>

      </UPage>
    )
  }

  onChange = e => {
    this.setState({isRead: !e.detail.value[0]})
  }
}
