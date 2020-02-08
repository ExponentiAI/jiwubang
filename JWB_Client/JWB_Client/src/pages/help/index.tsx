import Taro, { Component, Config, getUserInfo } from '@tarojs/taro'
import { View, Checkbox, Text, Map, Progress, CheckboxGroup } from '@tarojs/components'
import { UPage } from '../../components/ui'
import { LocationPicker, PrescriptionPicker, WGoods, UserInfo } from '../../components/widget'
import {
  AtButton, AtAccordion, AtTextarea,
  AtModal, AtAvatar
} from 'taro-ui'

import QQMapWX from '../../libs/qqmap-wx-jssdk'

import myLocation from '../../assets/images/icon/my-location.png'

import './index.scss'

import http from '../../libs/http'

import {getGlobalData, setGlobalData, getLogininfo} from "../../models/globalData"

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
  // unitToast: boolean;
  submitClick: boolean;
  latitude: number;
  longitude: number;
  address: any;
  markers: Array<any>;
  progress: number;
}

export default class Index extends Component {


  state: State
  config: Config = {
    navigationBarTitleText: '信息求助'
  }

  componentDidMount() {

  }

  componentWillMount() {
    // let latitude = this.$router.params.latitude;
    // let longitude = this.$router.params.longitude;
    // let address = this.$router.params.address;

    let latitude = getGlobalData('latitude')
    let longitude = getGlobalData('longitude')
    let address = getGlobalData('address')

    this.setState({ latitude: latitude })
    this.setState({ longitude: longitude })
    this.setState({ address: address })

    this.getLocationInfo()
  }

  // 预加载用户当前所在的坐标和地址信息
  getLocationInfo() {
    this.reLocation()
  }

  //重新获取位置
  async reLocation() {
    let qqmapsdk = new QQMapWX({
      key: 'E56BZ-VCOLX-Q7Q4N-7OE7Y-LHKK3-MPBD5'
    })

    qqmapsdk.reverseGeocoder({
      get_poi: 0,
      success: (res) => {
        const latitude = res.result.location.lat
        const longitude = res.result.location.lng
        this.setState({
          latitude,
          longitude,
          address: res.result.address_component,
          markers: [{
            iconPath: myLocation,
            id: 1,
            latitude,
            longitude,
            width: 40,
            height: 40,
            callout: {
              content: "我的位置",
              color: "#FFFFFF",
              bgColor: "#455a64",
              display: 'ALWAYS',
              textAlign: 'center'
            }
          }]
        })
      }
    })
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
      // unitToast: false,
      submitClick: false,
      latitude: 0,
      longitude: 0,
      address: '',
      markers: [],
      progress: 25,
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

    const userInfo = getLogininfo()

    return (
      <UPage
        className='p-demand-page'
        showBottom
        titleImmerse
        renderBottom={
          <View>
            <Progress className='p-progress' percent={this.state.progress} strokeWidth={2} activeColor='#FFC82C' />
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
          content='1. 用户须对在“急物帮”的注册信息的真实性、合法性承担全部责任。
          2. 用户承诺不得以任何方式利用“急物帮”直接或间接从事违反中国法律以及社会公德的行为，“急物帮”有权对违反上述承诺的内容予以删除。
          3. 用户须填写真实、准确、可靠的信息，“急物帮”对虚假、谣传、诽谤信息，保留上报行政机关的义务和追究法律责任的权利。
          4. 用户须参考周边疫情分布情况，避免到易感染区域采购生活物资。
          5. 声明：部分数据来自全国各地的志愿者，根据官方发布的信息进行整理，精确度存在一定偏移，一切以官方为准。'
        >
        </AtModal>


        <View className='p-accordion'>
          <Text className='p-tips'>已加载</Text>
          <AtAccordion
            open={showMyAccordion}
            onClick={(val) => this.setState({ showMyAccordion: val })}
            title='用户绑定'
          >
            <View className='p-userInfoPanel'>
              <AtAvatar className='p-userimage'
                image = {userInfo.avatar_url}
                openData = {{type: 'userAvatarUrl'}}
                circle
                size='normal'>
              </AtAvatar>
              <Text className='p-username'>
                {userInfo.nick_name}
              </Text>
            </View> 
          </AtAccordion>
        </View>


        <View className='p-accordion'>
          <Text className='p-tips'>已加载</Text>
          <AtAccordion
            open={showShopAccordion}
            onClick={(val) => this.setState({ showShopAccordion: val })}
            title='所需位置'
            isAnimation
          >
            <Map
              markers={this.state.markers}
              latitude={this.state.latitude}
              longitude={this.state.longitude}
              scale={15}
              className='p-map'
            />
          </AtAccordion>

        </View>

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
              checked={option.checked}
              handleValue={this.handleGoodsValue.bind(this)}
            ></WGoods>)
          })
        }

        <LocationPicker
          handleValue={this.handleLocationValue.bind(this)}>

        </LocationPicker>

        <PrescriptionPicker
          handleValue={this.handlePrescriptionValue.bind(this)}>

        </PrescriptionPicker>

      </UPage>

    )
  }

  handleGoodsValue(data) {
    if (data.checked) {
      this.state.goodsChecked[parseInt(data.index) - 1] = true
      this.state.goodsValue[parseInt(data.index) - 1] = data.value
      if(data.value != -1){
        this.setState({progress: 100})
      }else{
        this.setState({progress: 25})
      }
    } else {
      this.state.goodsChecked[parseInt(data.index) - 1] = false
      this.state.goodsValue[parseInt(data.index) - 1] = -1
      
      let check, flag = false
      for (check in this.state.goodsChecked){
        if(this.state.goodsChecked[check]){
          flag = true
        }
      }
      if(!flag){
        this.setState({progress: 25})
      }
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
    // const time = new Date()

    const date = new Date()
			
    const year = date.getFullYear()        //年 ,从 Date 对象以四位数字返回年份
    const month = date.getMonth() + 1      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
    const day = date.getDate()             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
    
    const hours = date.getHours()          //小时 ,返回 Date 对象的小时 (0 ~ 23)
    const minutes = date.getMinutes()      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
    const seconds = date.getSeconds()      //秒 ,返回 Date 对象的秒数 (0 ~ 59) 

    
    const currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds

    let check

    let flag = true

    let goods_input_flag = false  //判断用户是否填写物品信息，为true表示可以提交，false表示不可以提交

    // this.setState({submitClick: true})

    for (check in this.state.goodsChecked) {
      if (this.state.goodsChecked[check] && this.state.goodsValue[check] == -1) {
        flag = false
      }
    }
    
    for (check in this.state.goodsChecked) {
      if (this.state.goodsChecked[check]){
        goods_input_flag = true
      }
    }

    if (!flag) {    //填写不符合要求
      Taro.showToast({ title: '有数据尚未填写', icon: 'none' })
    } else if (!goods_input_flag) {
      Taro.showToast({ title: '物品尚未选择', icon: 'none' })
    } else {
      let goodsData = []
      for (var i = 0; i < this.state.goodsChecked.length; i++) {
        if (this.state.goodsChecked[i]) {     //如果有勾选
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
          subtime: currentDate,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        method: 'POST',
      }).then(res => {
          console.log(res.data.msg)
          if(res.data.msg == '操作成功！'){
            Taro.redirectTo({
              url: `../home/index?submit_id=${1}`
            })
          }
        })
    }
  }
}