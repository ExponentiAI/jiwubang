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
  testResData: any; // 测试地图绘制用的数据,实际操作时会使用服务器的返回数据

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
      testResData: {
        "id":xxx,
        "location":{
            "longitude":xxx,
            "latitude":xxx
        },
        "address":{
            "nation":xxx,
            "province":xxx,
            "city":xxx,
            "street":xxx,
        },
        "content":xxx,
        "goods":{
            "口罩":xxx
        }
    } // 测试地图绘制用的数据,实际操作时会使用服务器的返回数据
    }
  }

  componentWillMount() {

    this.getLocationInfo()

  }

  // 从腾讯地图获取用当前所在的坐标和地址信息
  async getLocationInfo() {
    this.reLocation()
  }

  //重新获取位置
  reLocation() {
    let qqmapsdk = new QQMapWX({
      key: 'E56BZ-VCOLX-Q7Q4N-7OE7Y-LHKK3-MPBD5'
    })

    qqmapsdk.reverseGeocoder({
      get_poi: 0,
      success:(res) =>{
        // console.log(res.result.address_component)
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
              // padding:10,
              display:'ALWAYS',
              textAlign:'center'
            }
          }]
        })
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

  // 把从服务器的查询结果绘制成marker
  markerDisplay({ detail: { longitude, latitude } }: MapProps) {
    console.log(longitude, latitude)
    let newMarkers = this.state.markers
    newMarkers.push({
      iconPath: markerPic,
            id: 2,
            latitude,
            longitude,
            width: 20,
            height: 30,
            callout:{
              content: "2020年2月3日\n" + "沃尔玛超市\n" + " N95口罩-" + "10元",
              color: "#FFFFFF",
              bgColor: "#3D91ED",
              // padding:10,
              display:'BYCLICK',
              textAlign:'center'
            }
    })
    this.setState({
      markers: newMarkers
    })
  }
  tabsClick(value) {
    this.setState({
      tabsIdx: value
    })
  }

  render() {
    const { keyword, tabBarIdx, markers, tabsIdx, latitude, longitude } = this.state

    return (
      <UPage
        className='p-home-page'
        showBottom
        renderBottom={
          <WTab className='g-safe-area'></WTab>
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
          onClick={this.markerDisplay.bind(this)}
          scale='15'
          className='p-map'
        />

        <view style={{display:"none", justifyContent:'center'}}>
         <Image src={scrollUpIco} style='width:25px; height:20px;position:absolute;top:40%;left:48%' ></Image></view>

        <AtTabs className='p-tabs' current={tabsIdx} tabList={this.tabList} onClick={this.tabsClick.bind(this)}>
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
