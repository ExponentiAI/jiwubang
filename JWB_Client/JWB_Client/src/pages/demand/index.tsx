import Taro, { Component, Config } from '@tarojs/taro'
import { View, Checkbox, Text, Map, Progress, CheckboxGroup } from '@tarojs/components'
import { UPage } from '../../components/ui'
import { LocationPicker, PrescriptionPicker, WGoods } from '../../components/widget'
import {
  AtButton, AtAccordion, AtTextarea,
  AtModal, AtToast
} from 'taro-ui'

import './index.scss'

export interface State {
  showMyAccordion: boolean;
  showShopAccordion: boolean;
  showLocationRangeAccordion: boolean;
  showPrescriptionAccordion: boolean;
  showMeAccordion: boolean;
  checkboxOption: Array<any>;
  isOpened: boolean;
  isRead: boolean;
  contentValue: string;
  goodsValue: Array<any>;
  goodsChecked: Array<any>;
  unitToast: boolean;
  submitClick: boolean;
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
      showMeAccordion: false,
      checkboxOption: [],
      isOpened: false,
      isRead: true,
      contentValue: '',
      goodsValue: [-1, -1, -1, -1, -1],
      goodsChecked: [false, false, false, false, false],
      unitToast: false,
      submitClick: false,
    }
  }

  checkboxOption = [{
    id: 1,
    value: '1',
    label: '外科用口罩',
    unit: '元/只',
    checked: false,
  }, {
    id: 2,
    value: '2',
    label: 'N95口罩',
    unit: '元/只',
    checked: false,
  }, {
    id: 3,
    value: '3',
    label: '普通一次性口罩',
    unit: '元/只',
    checked: false,
  }, {
    id: 4,
    value: '4',
    label: '医用酒精',
    unit: '元/瓶',
    checked: false,
  }, {
    id: 5,
    value: '5',
    label: '84消毒液',
    unit: '元/瓶',
    checked: false,
  }
  ]

  render() {
    const { showMyAccordion, showShopAccordion, showMeAccordion,
      isOpened, contentValue } = this.state


    return (
      <UPage
        className='p-demand-page'
        showBottom
        titleImmerse
        renderBottom={
          <View>
            <Progress className='p-progress' percent={25} strokeWidth={2} activeColor='#FFC82C' />
            <View className='p-bottom-wrap g-safe-area'>
              <CheckboxGroup onChange={this.onChange.bind(this)}>
                <Checkbox className='p-clause' value='isRead'>我已阅读</Checkbox>
              </CheckboxGroup>
              <Text className='p-text' onClick={() => { this.setState({ isOpened: true }) }}>《用户发布守则》</Text>
              <View className='p-submit'>
                <AtButton className='p-submit-btn' type='primary' 
                circle size='normal' customStyle={{ width: '100%' }}
                disabled={this.state.isRead}
                onClick={this.onSubmit.bind(this)}
                >提交</AtButton>
              </View>
            </View>
          </View> 
        }
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
          open={showMeAccordion}
          onClick={(val) => this.setState({ showMeAccordion: val })}
          title='我的位置'
        >
          <Map
            // latitude={latitude} //把纬度传到这里
            // longitude={longitude} //把经度传到这里
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
            // latitude={latitude} //把纬度传到这里
            // longitude={longitude} //把经度传到这里
            // onClick={this.mapClick.bind(this)}
            className='p-map'
          />
        </AtAccordion>

        <AtTextarea
          customStyle={{ border: 'none', borderRadius: 0 }}
          value={contentValue}
          onChange={(e) => {this.setState({contentValue: e.detail.value})}}
          maxLength={100}
          placeholder='描述你的信息需求...'
        />

        <View className='divider'/>

        <View className='itemTitle'>
          所需物品
        </View>

        {
          this.checkboxOption.map((option) => {
            return (<WGoods
              id={option.id}
              key={option.id}
              value={option.value}
              label={option.label}
              unit={option.unit}
              checked = {option.checked}
              handleValue = {this.handleGoodsValue.bind(this)}
            ></WGoods>)
          })
        }

        {this.state.unitToast  && <AtToast isOpened text="有数据尚未填写"></AtToast>}

      </UPage>
    )
  }

  onSubmit = (e) => {
    const time = new Date().getTime()

    let check

    let flag = true

    for(check in this.state.goodsChecked){
      if(this.state.goodsChecked[check] && this.state.goodsValue[check]==-1){
        flag = false
      }
    }
    if(!flag){    //填写不符合要求
      this.setState({unitToast: true})
    }else{
      this.setState({unitToast: false})
      let goodsData = []
      for(var i = 0; i < this.state.goodsChecked.length; i++){
        if(this.state.goodsChecked[i]){     //如果有勾选
          goodsData.push({
            'goods_name': this.checkboxOption[i].label,
            'num_or_price': this.state.goodsValue[i]
          })
        }
      }
      console.log(goodsData)
    //   Taro.request({
    //         url: 'https://jwb.comdesignlab.com/SupAndDem/',
    //         data: {
    //           u_id: 123,
    //           lon: 12.1,
    //           lat: 22.32,
    //           nation: '中国',
    //           province: '广东省',
    //           city: '汕头市',
    //           district: '澄海区',
    //           street: '溪南镇',
    //           street_number: '19',
    //           content: this.state.contentValue,
    //           type: 0,
    //           goods: JSON.stringify(goodsData),
    //           range: this.state.locationValue,
    //           aging: this.state.prescriptionValue,
    //           subtime: time,
    //         },
    //         header: {
    //           'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    //         },
    //         method: 'POST',
    //       })
    //       .then(res => console.log(res.data))
    }
  }

  handleGoodsValue(data) {
    if(data.checked){
      this.state.goodsChecked[parseInt(data.index)-1] = true
      this.state.goodsValue[parseInt(data.index)-1] = data.value
    }else{
      this.state.goodsChecked[parseInt(data.index)-1] = false
      this.state.goodsValue[parseInt(data.index)-1] = 0
    }
  }

  onChange = e => {
    this.setState({isRead: !e.detail.value[0]})
  }
}


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

// import Taro, { Component, Config } from '@tarojs/taro'
// import { View, Checkbox, Text, Map, Progress, CheckboxGroup } from '@tarojs/components'
// import { UPage } from '../../components/ui'
// import { LocationPicker, PrescriptionPicker, WGoods } from '../../components/widget'
// import {
//   AtButton, AtAccordion, AtTextarea,
//   AtModal, AtDivider 
// } from 'taro-ui'

// import './index.scss'

// export interface State {
//   showMyAccordion: boolean;
//   showShopAccordion: boolean;
//   showLocationRangeAccordion: boolean;
//   showPrescriptionAccordion: boolean;
//   checkboxOption: Array<any>;
//   isOpened: boolean;
//   isRead: boolean;
//   value: string;
// }

// export default class Index extends Component {
//   state: State
//   config: Config = {
//     navigationBarTitleText: '信息提供'
//   }

//   componentDidMount() {

//   }

//   constructor() {
//     super(...arguments)
//     this.state = {
//       showMyAccordion: false,
//       showShopAccordion: false,
//       showLocationRangeAccordion: false,
//       showPrescriptionAccordion: false,
//       checkboxOption: [],
//       isOpened: false,
//       isRead: true,
//       value: '',
//     }
//   }

//   checkboxOption = [{
//     id: 1,
//     value: '1',
//     label: '外科用口罩',
//     unit: '只',
//   }, {
//     id: 2,
//     value: '2',
//     label: 'N95口罩',
//     unit: '只',
//   }, {
//     id: 3,
//     value: '3',
//     label: '普通一次性口罩',
//     unit: '只',
//   }, {
//     id: 4,
//     value: '4',
//     label: '医用酒精',
//     unit: '瓶',
//   }, {
//     id: 5,
//     value: '5',
//     label: '84消毒液',
//     unit: '瓶',
//   }
//   ]

//   render() {
//     const { showMyAccordion, showShopAccordion,
//       isOpened, value } = this.state


//     return (
//       <UPage
//         className='p-demand-page'
//         showBottom
//         titleImmerse
//         renderBottom={
//           <View>
//             <Progress className='p-progress' percent={25} strokeWidth={2} activeColor='#FFC82C' />
//             <View className='p-bottom-wrap g-safe-area'>
//               <CheckboxGroup onChange={this.onChange.bind(this)}>
//                 <Checkbox className='p-clause' value='isRead'>我已阅读</Checkbox>
//               </CheckboxGroup>
//               <Text className='p-text' onClick={() => { this.setState({ isOpened: true }) }}>《用户发布守则》</Text>
//               <View className='p-submit'>
//                 <AtButton className='p-submit-btn' type='primary' 
//                 circle size='normal' customStyle={{ width: '100%' }}
//                 disabled={this.state.isRead}>提交</AtButton>
//               </View>
//             </View>
//           </View> 
//         }

//       >
//         <AtModal
//           isOpened={isOpened}
//           title='使用守则'
//           confirmText='确认'
//           onClose={() => { this.setState({ isOpened: false }) }}
//           onConfirm={() => { this.setState({ isOpened: false }) }}
//           content='欢迎使用急物帮'
//         >
//         </AtModal>

//         <AtAccordion
//           open={showMyAccordion}
//           onClick={(val) => this.setState({ showMyAccordion: val })}
//           title='用户绑定'
//         >
//           {/* <Map
//             // onClick={this.mapClick.bind(this)}
//             className='p-map'
//           /> */}
//         </AtAccordion>

//         <AtAccordion
//           open={showShopAccordion}
//           onClick={(val) => this.setState({ showShopAccordion: val })}
//           title='所需位置'
//         >
//           <Map
//             // onClick={this.mapClick.bind(this)}
//             className='p-map'
//           />
//         </AtAccordion>

//         <AtTextarea
//           customStyle={{ border: 'none', borderRadius: 0 }}
//           value={value}
//           onChange={(e) => {this.setState({value: e.detail.value})}}
//           maxLength={100}
//           placeholder='描述你的信息需求...'
//         />

//         <View className='divider'/>

//         <View className='itemTitle'>
//           所需物品
//         </View>

//         {
//           this.checkboxOption.map((option) => {
//             return (<WGoods
//               id={option.id}
//               key={option.id}
//               value={option.value}
//               label={option.label}
//               unit={option.unit}
//             ></WGoods>)
//           })
//         }

//         <LocationPicker></LocationPicker>

//         <PrescriptionPicker></PrescriptionPicker>

//       </UPage>
//     )
//   }

//   onChange = e => {
//     this.setState({isRead: !e.detail.value[0]})
//   }
// }
