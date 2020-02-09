import Taro, { Component, Config, getStorageSync } from '@tarojs/taro'
import { MapProps } from '@tarojs/components/types/Map'
import { View, Text, Image, Navigator, Button, Map } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction, AtTabBar, AtSearchBar, AtTabs, AtTabsPane, AtDivider } from 'taro-ui'
import { UPage } from '../../components/ui'
import { WTab, WMessageItem } from '../../components/widget'
import QQMapWX from '../../libs/qqmap-wx-jssdk'
import myLocation from '../../assets/images/icon/my-location.png'
import demandMarker from '../../assets/images/icon/marker1.png'
import supplyMarker from '../../assets/images/icon/marker2.png'
import './index.less'
import { scrollUpIco, bottomIcon } from '../../assets/images/icon'
import {getGlobalData, setGlobalData, getLogininfo,setLogininfo} from "../../models/globalData"
import {gotologin} from '../../models/gotoLogin'

import http from '../libs/http'
// eslint-disable-next-line
const { regeneratorRuntime } = global;

export interface State {
  open: boolean;
  homeData: any;
  tabBarIdx: number;
  keyword: string;
  tabsIdx: number;
  latitude: number;
  longitude: number;
  address: any;
  markers: Array<any>;
  resData: Array<Object>;
  submitresult: number;

  qqmapsdk: QQMapWX;
  distances:Array<any>;
  myData: Array<any>;
}

export default class Index extends Component<{}, State> {

  state: State

  config: Config = {
    navigationBarTitleText: '信息求助',
    navigationStyle: 'custom',
  }

  onShareAppMessage(e) {
    return {
      title: '急物帮',
      path: `pages/home/index`,
      imageUrl: bottomIcon,
      success: function (res) {
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      open: !false,
      homeData: {},
      tabBarIdx: 0,
      keyword: '',
      tabsIdx: 0,
      latitude: 0,
      longitude: 0,
      address: {},
      markers: [],
      resData: [],
      submitresult: -1,

      qqmapsdk: new QQMapWX({
        key: 'WHEBZ-3YWEX-R7V4Y-7U6AV-HXTKK-7EFIN'
        // key: 'E56BZ-VCOLX-Q7Q4N-7OE7Y-LHKK3-MPBD5'
      }),
      distances: [],
      myData: [],
    }
  }

  componentWillMount() {
    // console.log('测试一下'+getStorageSync('logininfo'))
    Taro.checkSession({
      success: function() {
        //console.log("session_key 未过期")
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function() {
        // session_key 已经失效，需要重新执行登录流程
        // 登录
        gotologin()
        setLogininfo()
      }
    })

    this.getLocationInfo()

    let submitResult = this.$router.params.submit_id;
    // this.setState({ submitresult: parseInt(submitResult)})
    if(parseInt(submitResult) == 1){
      Taro.showToast({title: '发布成功'})
    }
    //this.getNeerInfo()
  }

  /*
  * 预加载
  * 
  * */
async getNearInfo(finishCallback){
  if(this.state.latitude != 0){
    Taro.request({
      url: 'https://jwb.comdesignlab.com/new/1/',
      data: JSON.stringify({
        longitude: this.state.longitude,
        latitude: this.state.latitude,
        search_range: 10,
        page_items_count: 6,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
    })
    .then(res => { 
      // console.log(res.data)
      this.setState({
        resData: res.data
      }, finishCallback)
    })
    // .then(res => this.setState({...}, finishCallback))
  }
}


// 计算checkin位置到用户当前位置的距离，结果保存在this.state.distances里
getDistance() {
  let resData = this.state.resData
  let locations = []

  for (let i = 0; i < resData.length; i++) {
    locations.push({
      latitude: resData[i].s_lat,
      longitude: resData[i].s_lon,
    })
  }
  this.state.qqmapsdk.calculateDistance({
    to: locations,
    success: (res) => {
      this.setState({
        distances: res.result.elements
      })
    }
  })
}

  // 预加载用户当前所在的坐标和地址信息
  getLocationInfo() {
    // this.reLocation(()=>{this.markerPush()})
    // this.reLocation(()=>{this.getNearInfo()})

    this.reLocation(
      ()=>{this.getNearInfo(
        ()=>{
          this.markerPush()
          this.getDistance()
        }
      )}
    )
    
  }

  //重新获取位置
  async reLocation(finishCallback) {

    this.state.qqmapsdk.reverseGeocoder({
      get_poi: 0,
      success:(res) =>{
        const latitude = res.result.location.lat
        const longitude = res.result.location.lng
        const address = res.result.address_component
        
        setGlobalData('latitude', latitude)
        setGlobalData('longitude', longitude)
        setGlobalData('address', address)

        this.setState({
          latitude,
          longitude,
          address: address,
          markers: [{
            iconPath: myLocation,
            id: 0,
            latitude,
            longitude,
            width: 40,
            height: 40,
            callout:{
              content:"我的位置",
              color: "#FFFFFF",
              bgColor: "#455a64",
              display:'ALWAYS',
              textAlign:'center'
            }
          }]
        }, finishCallback)
      }
    })
  }

  // async getLocation() {
  //   const location = await Taro.getLocation({isHighAccuracy: true}) as Taro.getLocation.SuccessCallbackResult
  //   const latitude = location.latitude
  //   const longitude = location.longitude

  //   this.setState({
  //     latitude,
  //     longitude,
  //     markers: [{
  //       iconPath: mapLocation,
  //       id: 0,
  //       latitude,
  //       longitude,
  //       width: 50,
  //       height: 50
  //     }]
  //   })
  // }

  tabList = [{ title: '附近' }, { title: '我的' }]

  tabbarClick() {

  }
  searchChange() {

  }

  // 把从服务器的查询结果添加到markers列表中
  markerPush() {
    let newMarkers = this.state.markers
    let resData = this.state.resData
    let goodsInfo = ''
    // console.log(resData)

    if(resData.length > 0) {
      for (let i = 0; i < resData.length; i++) {
        if(resData[i].details_info.length > 0) {
          if(resData[i].s_type == 1) {
            // console.log(resData[i])
            
            for(let j = 0; j < resData[i].details_info.length; j++) {
              goodsInfo = resData[i].details_info[j].goods_name + resData[i].details_info[j].count + '元/个\n'
            }
            newMarkers.push({
              iconPath: supplyMarker,
              id: i+1,
              latitude: resData[i].s_lat,
              longitude: resData[i].s_lon,
              width: 20,
              height: 30,
              callout: {
                content: resData[i].s_street + '\n' + resData[i].store_name + '\n有' + goodsInfo + resData[i].s_subtime,
                // content: '测试',
                color: "#FFFFFF",
                bgColor: "#3D91ED",
                display:'BYCLICK',
                textAlign:'center'
              }
            })
          } else {
            for(let j = 0; j < resData[i].details_info.length; j++) {
              goodsInfo = resData[i].details_info[j].goods_name + resData[i].details_info[j].count + '个\n'
            }
            newMarkers.push({
              iconPath: demandMarker,
              id: i+1,
              latitude: resData[i].s_lat,
              longitude: resData[i].s_lon,
              width: 20,
              height: 30,
              callout: {
                content: resData[i].s_street + '\n需' + goodsInfo + resData[i].s_subtime,
                // content: '测试',
                color: "#3D91ED",
                bgColor: "#FFFFFF",
                display:'BYCLICK',
                textAlign:'center'
              }
            })
          }
        }
      }
    }
    // console.log(newMarkers)
    
    this.setState({
      markers: newMarkers
    })
  }

  tabsClick(value) {
    this.setState({
      tabsIdx: value
    })
    Taro.request({
      url: 'https://jwb.comdesignlab.com/me/1/',
      data: JSON.stringify({
        u_id: 1,
        page_items_count: 10,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
    })
    .then(res => { 
      this.setState({
        myData: res.data
      })
    })
    
  }

  // 用户手动点击地图选择位置信息（该功能准备在下一版中开放）
  getLocationByTap({ detail: { longitude, latitude } }: MapProps) {
    console.log('你点击的位置是： ' + '[ ' + longitude + ', ' + latitude + ' ]')
  }

  // 点击位置实现导航
  goThere({ markerId }: MapProps) {
    // console.log(this.state.markers[markerId])
    // console.log(markerId)
    let latitude = this.state.markers[markerId].latitude
    let longitude = this.state.markers[markerId].longitude

    Taro.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 15,
    })
  }

  // tabsClick(value) {
  //   this.setState({
  //     tabsIdx: value
  //   })
  // }

  render() {
    const { keyword, tabBarIdx, markers, tabsIdx, latitude, longitude, address } = this.state
    //this.markerPush()

    // console.log(this.state.resData)
    // console.log(this.state.distances)

    
    return (
      <UPage
        className='p-home-page'
        showBottom
        renderBottom={
          <WTab 
            className='g-safe-area' 
            latitude={latitude} 
            longitude={longitude} 
            address={address}
            >
          </WTab>
        }
        renderTop={
          <AtSearchBar
            value={keyword}
            onChange={this.searchChange.bind(this)}
            className='p-search-bar'
            showActionButton
          />
        }>

        <Map
          markers={markers}
          latitude={latitude}
          longitude={longitude}
          scale={14}
          className='p-map'
          // onClick={this.getLocationByTap.bind(this)} //在地图中手动选择位置（预留在下一版app中开放）
          // onClick={this.getDistance.bind(this)} //测试计算距离
          // onClick={this.goThere.bind(this)}
          onCalloutTap={this.goThere.bind(this)}
        />

        <view style={{display:"none", justifyContent:'center'}}>
         <Image src={scrollUpIco} style='width:25px; height:20px;position:absolute;top:40%;left:48%' ></Image></view>

        <AtTabs 
          className='p-tabs' current={tabsIdx} tabList={this.tabList} 
          onClick={this.tabsClick.bind(this)}>
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={0}>
            {
              this.state.resData.map((item, index) => {
                return (
                  <WMessageItem 
                    key = {index}
                    itemData = {item}
                    style='border-bottom: 3rpx solid #666'
                    distance = {this.state.distances[index]}
                    >
                  </WMessageItem>
                )
              })
            }
          </AtTabsPane>
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={1}>
          {
              this.state.myData.map((item, index) => {
                return (
                  <WMessageItem 
                    key = {index}
                    itemData = {item}
                    style='border-bottom: 3rpx solid #666'
                    distance = {[]}
                    >
                  </WMessageItem>
                )
              })
            }
          </AtTabsPane>
        </AtTabs>
      </UPage>
    )
  }
}
