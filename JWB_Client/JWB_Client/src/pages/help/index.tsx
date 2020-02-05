import Taro, { Component, Config } from '@tarojs/taro'
import { View, Checkbox, Text, Map, Progress, CheckboxGroup } from '@tarojs/components'
import { UPage } from '../../components/ui'
import { LocationPicker, PrescriptionPicker, WGoods } from '../../components/widget'
import {
  AtButton, AtAccordion, AtTextarea,
  AtModal, AtDivider, AtToast 
} from 'taro-ui'

import './index.scss'

import http from '../../libs/http'

export interface State {
  showMyAccordion: boolean;
  showShopAccordion: boolean;
  showLocationRangeAccordion: boolean;
  showPrescriptionAccordion: boolean;
  checkboxOption: Array<any>;
  isOpened: boolean;
  isRead: boolean;
  contentValue: string;
  locationValue: number;
  prescriptionValue: number;
  goodsValue: Array<any>;
  goodsChecked: Array<any>;
  unitToast: boolean;
  submitClick: boolean;
  latitude: number;
  longitude: number;
  address: any;
}

export default class Index extends Component {


  state: State
  config: Config = {
    navigationBarTitleText: '信息求助'
  }

  componentDidMount() {

  }

  componentWillMount() {
    let latitude = this.$router.params.latitude;
    let longitude = this.$router.params.longitude;
    let address = this.$router.params.address;
    this.setState({latitude: latitude})
    this.setState({longitude: longitude})
    this.setState({address: JSON.parse(address)})
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
      contentValue: '',
      locationValue: 1,
      prescriptionValue: 1,
      goodsValue: [-1, -1, -1, -1, -1],
      goodsChecked: [false, false, false, false, false],
      unitToast: false,
      submitClick: false,
      latitude: 0,
      longitude: 0,
      address: '',
    }
  }

  checkboxOption = [{
    id: 1,
    value: '1',
    label: '外科用口罩',
    unit: '只',
    checked: false,
  }, {
    id: 2,
    value: '2',
    label: 'N95口罩',
    unit: '只',
    checked: false,
  }, {
    id: 3,
    value: '3',
    label: '普通一次性口罩',
    unit: '只',
    checked: false,
  }, {
    id: 4,
    value: '4',
    label: '医用酒精',
    unit: '瓶',
    checked: false,
  }, {
    id: 5,
    value: '5',
    label: '84消毒液',
    unit: '瓶',
    checked: false,
  }
  ]

  render() {
    const { showMyAccordion, showShopAccordion,
      isOpened, contentValue } = this.state

    // this.setState({submitClick: false})

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
          value={contentValue}
          onChange={(e) => { this.setState({ contentValue: e.detail.value }) }}
          maxLength={100}
          placeholder='描述你的信息需求...(非必填)'
        />

        <View className='divider' />

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

        <LocationPicker
          handleValue = {this.handleLocationValue.bind(this)}>

        </LocationPicker>

        <PrescriptionPicker
          handleValue = {this.handlePrescriptionValue.bind(this)}>

        </PrescriptionPicker>

        {/* <AtToast isOpened={this.state.unitToast && this.state.submitClick} text="有数据尚未填写"></AtToast> */}
        
        {this.state.unitToast  && <AtToast isOpened text="有数据尚未填写"></AtToast>}

      </UPage>

    )
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

  handleLocationValue(data) {
    this.setState({
      locationValue: data
    })
  }

  handlePrescriptionValue(data) {
    this.setState({
      prescriptionValue: data
    })
  }

  onChange = e => {
    this.setState({ isRead: !e.detail.value[0] })
  }

  onSubmit = (e) => {
    const time = new Date().getTime()

    let check

    let flag = true

    // this.setState({submitClick: true})

    for(check in this.state.goodsChecked){
      // console.log(this.state.goodsChecked[check])
      // console.log(this.state.goodsValue[check])
      if(this.state.goodsChecked[check] && this.state.goodsValue[check]==-1){
        flag = false
      }
    }
    // console.log(check)
    // console.log(flag)
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
      Taro.request({
            url: 'https://jwb.comdesignlab.com/SupAndDem/',
            data: {
              u_id: 123,
              lon: this.state.longitude,
              lat: this.state.latitude,
              nation: this.state.address.nation,
              province: this.state.address.province,
              city: this.state.address.city,
              district: this.state.address.district,
              street: this.state.address.street,
              street_number: this.state.address.street_number,
              content: this.state.contentValue,
              type: 0,
              goods: JSON.stringify(goodsData),
              range: this.state.locationValue,
              aging: this.state.prescriptionValue,
              subtime: time,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
          })
          .then(res => console.log(res.data))

    }

  }
}