import Taro, { Component, Config } from '@tarojs/taro'
import { MapProps } from '@tarojs/components/types/Map'
import { View, Text, Image, Navigator, Button, Map } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction, AtTabBar, AtSearchBar, AtTabs, AtTabsPane, AtDivider } from 'taro-ui'
import { UPage } from '../../components/ui'
import { WTab, WMessageItem } from '../../components/widget'
import QQMapWX from '../../libs/qqmap-wx-jssdk'
import myLocation from '../../assets/images/icon/my-location.png'
import markerPic from '../../assets/images/icon/marker.png'
import relocating from '../../assets/images/icon/relocating.png'
import './index.less'
import { scrollUpIco } from '../../assets/images/icon'
import {getGlobalData, setGlobalData} from "global"

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
  resData: Array<any>;
}

export default class Index extends Component<{}, State> {
  config: Config = {
    navigationBarTitleText: '信息求助',
    navigationStyle: 'custom',
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
    }
  }

  componentWillMount() {

    this.getLocationInfo()

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
      this.setState({
        resData: res.data
      }, finishCallback)
    })
    // .then(res => this.setState({...}, finishCallback))
  }
}


  // 预加载用户当前所在的坐标和地址信息
  getLocationInfo() {
    // this.reLocation(()=>{this.markerPush()})
    // this.reLocation(()=>{this.getNearInfo()})

    this.reLocation(
      ()=>{this.getNearInfo(
        ()=>{this.markerPush()}
      )}
    )
    
  }

  //重新获取位置
  async reLocation(finishCallback) {
    let qqmapsdk = new QQMapWX({
      key: 'E56BZ-VCOLX-Q7Q4N-7OE7Y-LHKK3-MPBD5'
    })

    qqmapsdk.reverseGeocoder({
      get_poi: 0,
      success:(res) =>{
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
            callout:{
              content:"我的位置",
              color: "#FFFFFF",
              bgColor: "#3D91ED",
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

  tabList = [{ title: '热门' }, { title: '最新' }, { title: '我的' }]

  tabbarClick() {

  }
  searchChange() {

  }

  // 把从服务器的查询结果添加到markers列表中
  markerPush() {
    let newMarkers = this.state.markers
    let resData = this.state.resData
    console.log(resData)

    if(resData.length > 0) {

      for (let i = 0; i < resData.length; i++) {
        console.log()
        newMarkers.push({
          iconPath: markerPic,
          id: resData[i].u_id,
          latitude: resData[i].s_lat,
          longitude: resData[i].s_lon,
          width: 20,
          height: 30,
          callout: {
            content: resData[i].s_street + '\n' + resData[i].s_content,
            // content: '测试',
            color: "#FFFFFF",
            bgColor: "#3D91ED",
            display:'BYCLICK',
            textAlign:'center'
          }
        })
        
      }
    }
    
    this.setState({
      markers: newMarkers
    })
  }
  tabsClick(value) {
    console.log("value" + value)
    this.setState({
      tabsIdx: value
    })
  }

  // 用户手动点击地图选择位置信息（该功能准备在下一版中开放）
  getLocationByTap({ detail: { longitude, latitude } }: MapProps) {
    console.log('你点击的位置是： ' + '[ ' + longitude + ', ' + latitude + ' ]')
  }

  // tabsClick(value) {
  //   this.setState({
  //     tabsIdx: value
  //   })
  // }

  render() {
    const { keyword, tabBarIdx, markers, tabsIdx, latitude, longitude, address } = this.state
    //this.markerPush()

    return (
      <UPage
        className='p-home-page'
        showBottom
        renderBottom={
          <WTab className='g-safe-area' latitude={latitude} longitude={longitude} address={address}>
            
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
          // onClick={this.getLocationByTap.bind(this)} //在地图中手动选择位置（预留在下一版app中开放）
          scale='15'
          className='p-map'
        />

        <view style={{display:"none", justifyContent:'center'}}>
         <Image src={scrollUpIco} style='width:25px; height:20px;position:absolute;top:40%;left:48%' ></Image></view>

        <AtTabs 
          className='p-tabs' current={tabsIdx} tabList={this.tabList} 
          onClick={this.tabsClick.bind(this)}>
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={0} >
            <WMessageItem></WMessageItem>
            <WMessageItem></WMessageItem>
            <WMessageItem></WMessageItem>
            <WMessageItem></WMessageItem>
            <WMessageItem></WMessageItem>
            <WMessageItem></WMessageItem>
            <WMessageItem></WMessageItem>
            <WMessageItem></WMessageItem>
            <WMessageItem style='border-bottom: none'></WMessageItem>
          </AtTabsPane>
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={1}>
            <WMessageItem></WMessageItem>
          </AtTabsPane>
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={2}>
            <WMessageItem style='border-bottom: none'></WMessageItem>
          </AtTabsPane>
        </AtTabs>
      </UPage>
    )
  }
}
