import Taro, { Component, Config, getStorageSync } from '@tarojs/taro'
import { MapProps } from '@tarojs/components/types/Map'
import { View, Text, Image, Navigator, Button, Map, CoverView, CoverImage } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction, AtTabBar, AtSearchBar, AtTabs, AtTabsPane, AtDivider } from 'taro-ui'
import { UPage } from '../../components/ui'
import { WTab, WMessageItem } from '../../components/widget'
import QQMapWX from '../../libs/qqmap-wx-jssdk'
import myLocation from '../../assets/images/icon/my-location.png'
import demandMarker from '../../assets/images/icon/marker1.png'
import supplyMarker from '../../assets/images/icon/marker2.png'
import refreshButton from '../../assets/images/icon/refresh.png'
import './index.less'
import { scrollUpIco, bottomIcon,medical2life } from '../../assets/images/icon'
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
  mapScale: number;
  neardistances: Array<any>;
  newestdistances: Array<any>;
  myData: Array<any>;
  newestData: Array<any>;
  type: string;
  modalShow:boolean;
  modalContent:string;
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
      type:'supply',
      modalShow:false,
      modalContent:'\n\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b切换到生活服务？',

      qqmapsdk: new QQMapWX({
        key: 'WHEBZ-3YWEX-R7V4Y-7U6AV-HXTKK-7EFIN'
        // key: 'E56BZ-VCOLX-Q7Q4N-7OE7Y-LHKK3-MPBD5'
      }),
      mapScale: 12,
      neardistances: [],
      newestdistances: [],
      myData: [],
      newestData: [],
    }
  }

  componentWillMount() {
    // Taro.checkSession({
    //   success: function() {
    //     //session_key 未过期，并且在本生命周期一直有效
    //   },
    //   fail: function() {
    //     // session_key 已经失效，需要重新执行登录流程
    //     // 登录
    // gotologin()
    // setLogininfo()
      // }
    // })

    this.getLocationInfo()

    let submitResult = this.$router.params.submit_id;
    // this.setState({ submitresult: parseInt(submitResult)})
    if(parseInt(submitResult) == 1){
      Taro.showToast({title: '发布成功'})
    }
  }

  /*
  * 预加载 最新信息
  * 
  * */
 async getNewestInfo(finishCallback){
  const curDate = new Date()
  const prevDate = new Date()
  prevDate.setDate(prevDate.getDate()-1)
			
  const end_time = curDate.getFullYear() + "-" + (curDate.getMonth()+1) + "-" + curDate.getDate() + " " + curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds()

  const start_time = prevDate.getFullYear() + "-" + (prevDate.getMonth()+1) + "-" + prevDate.getDate() + " " + prevDate.getHours() + ":" + prevDate.getMinutes() + ":" + prevDate.getSeconds()

  if(this.state.latitude != 0){
    console.log("token:",getLogininfo().token)
    Taro.request({
      url: 'https://jwb.comdesignlab.com/new/1?type='+this.state.type,
      data: JSON.stringify({
        longitude: this.state.longitude,
        latitude: this.state.latitude,
        search_range: 8,
        page_items_count: 30,
        start_time: start_time,
        end_time: end_time
      }),
      header: {
        'content-type': 'application/json;charset=utf-8',
        'token':getLogininfo().token,
      },
      method: 'POST',
    })
    .then(res => { 
      // console.log(res.data)
      if(res.statusCode == 500) {
        Taro.showToast({              
          title: '附近尚无用户发布信息',
          icon: 'none',
          duration: 2000
        })
      } else if(res.statusCode == 502) {
        Taro.showToast({
          title: '当前访问人数过多，请稍后再试...',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setState({
          newestData: res.data?res.data:[]
        }, finishCallback)
        console.log(res.data)
      }
    })
    // .then(res => this.setState({...}, finishCallback))
  }
}



  /*
  * 预加载 附近信息
  * 
  * */
async getNearInfo(finishCallback){
  const curDate = new Date()
  const prevDate = new Date()
  prevDate.setDate(prevDate.getDate()-3)
			
  const end_time = curDate.getFullYear() + "-" + (curDate.getMonth()+1) + "-" + curDate.getDate() + " " + curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds()

  const start_time = prevDate.getFullYear() + "-" + (prevDate.getMonth()+1) + "-" + prevDate.getDate() + " " + prevDate.getHours() + ":" + prevDate.getMinutes() + ":" + prevDate.getSeconds()
  
  if(this.state.latitude != 0){
    Taro.request({
      url: 'https://jwb.comdesignlab.com/nearby/1?type='+this.state.type,
      data: JSON.stringify({
        longitude: this.state.longitude,
        latitude: this.state.latitude,
        search_range: 2,
        page_items_count: 10,
        start_time: start_time,
        end_time: end_time 
        
      }),
      header: {
        'content-type': 'application/json;charset=utf-8',
        'token':getLogininfo().token
      },
      method: 'POST',
    })
    .then(res => { 
      if(res.statusCode == 500) {
        Taro.showToast({
          title: '附近尚无用户发布信息',
          icon: 'none',
          duration: 2000
        })
      } else if(res.statusCode == 502) {
        Taro.showToast({
          title: '当前访问人数过多，请稍后再试...',
          icon: 'none',
          duration: 2000
        })
      } else {
        //console.log(res.data)
        this.setState({
          resData: res.data?res.data:[]
        }, finishCallback)
      }
    })
    // .then(res => this.setState({...}, finishCallback))
  }
}

/*
  * 预加载 我的信息
  * 
  * */
 async getMyInfo(){

  const curDate = new Date()
  const prevDate = new Date()
  prevDate.setDate(prevDate.getDate()-5)
			
  const end_time = curDate.getFullYear() + "-" + (curDate.getMonth()+1) + "-" + curDate.getDate() + " " + curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds()

  const start_time = prevDate.getFullYear() + "-" + (prevDate.getMonth()+1) + "-" + prevDate.getDate() + " " + prevDate.getHours() + ":" + prevDate.getMinutes() + ":" + prevDate.getSeconds()
  //console.log(getLogininfo().openid)
  Taro.request({
    url: 'https://jwb.comdesignlab.com/me/1?type='+this.state.type,
    data: {
      u_id: getLogininfo().openid,
      page_items_count: 15,
      start_time: start_time,
      end_time: end_time
  
    },
    header: {
      'content-type': 'application/json;charset=utf-8',
      'token':getLogininfo().token
    },
    method: 'POST',
  }).then(res => {
    // console.log(res.data)
    if(res.statusCode == 500) {
      Taro.showToast({
        title: '您尚未发布任何信息',
        icon: 'none',
        duration: 2000
      })
    } else if(res.statusCode == 502) {
      Taro.showToast({
        title: '当前访问人数过多，请稍后再试...',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setState({
        myData: res.data?res.data:[]
      })
    }
  })
  
}


//点击位置实现导航
goThere({markerId}: MapProps){
  let lat, lon
  // console.log(markerId)
  // console.log(this.state.markers[markerId])
  // console.log(this.state.markers[markerId])
  if(this.state.markers[markerId].latitude){
    lat = this.state.markers[markerId].latitude
  }
  if(this.state.markers[markerId].longitude){
    lon = this.state.markers[markerId].longitude
  }

  Taro.openLocation({
    latitude: lat,
    longitude: lon,
    scale: 15,
  })
}


// 计算checkin位置到用户当前位置的距离，结果保存在this.state.distances里
getDistance(value) {
  let resData
  if(value == 0){
    resData = this.state.newestData
  }else if(value == 1){
    resData = this.state.resData
  }
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
      // console.log(res)
      if(value ==0) {
        this.setState({
          newestdistances: res.result.elements
        })
      } else if(value == 1) {
        this.setState({
          neardistances: res.result.elements
      }
    }
  })
}

  // 预加载用户当前所在的坐标和地址信息
  getLocationInfo() {
    // this.reLocation(()=>{this.markerPush()})
    // this.reLocation(()=>{this.getNearInfo()})

    this.reLocation(
      ()=>{this.getNewestInfo(
        ()=>{
          this.getDistance(0)
          this.getNearInfo(
            () => {
              this.markerPush(0)
              this.getDistance(1)
              this.getMyInfo()
            }
          )
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
            // markerId: 0,
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

  tabList = [{ title: '最新' }, { title: '附近' }, { title: '我的' }]

  tabbarClick() {

  }
  searchChange() {

  }

  // 把从服务器的查询结果添加到markers列表中
  markerPush(value) {
    let newMarkers = this.state.markers
    let resData
    let scale
    if(value == 0) {
      resData = this.state.newestData
      scale = 12
    } else if(value == 1) {
      resData = this.state.resData
      scale = 14
    }
    // console.log(resData.length)
    let goodsInfo = ''

    if(resData.length > 0) {
      let idCount = 0
      for (let i = 0; i < resData.length; i++) {
        if(resData[i].details_info.length > 0) {
          if(resData[i].s_type == 0) {
            for(let j = 0; j < resData[i].details_info.length; j++) {
              if(resData[i].details_info[j].goods_name=='其它\n'){
                goodsInfo += '其它'}
              else{goodsInfo += resData[i].details_info[j].goods_name + resData[i].details_info[j].count + '元/个\n'}
            }
            newMarkers.push({
              iconPath: supplyMarker,
              id: idCount+1,
              // markerId: idCount+1,
              latitude: resData[i].s_lat,
              longitude: resData[i].s_lon,
              width: 20,
              height: 30,
              callout: {
                content: resData[i].s_street + '\n' + resData[i].store_name + '\n需:' + goodsInfo + resData[i].s_subtime,
                // content: '测试',
                color: "#FFFFFF",
                bgColor: "#3D91ED",
                display:'BYCLICK',
                textAlign:'center'
              }
            })
            idCount = idCount + 1
          } else if (resData[i].s_type == 1){
            //console.log(resData[i])
            for(let j = 0; j < resData[i].details_info.length; j++) {
              if(resData[i].details_info[j].goods_name=='其它'){goodsInfo += '其它\n'}
              else{goodsInfo += resData[i].details_info[j].goods_name + resData[i].details_info[j].count + '元/个\n'}
            }
            newMarkers.push({
              iconPath: demandMarker,
              id: idCount+1,
              // markerId: idCount+1,
              latitude: resData[i].s_lat,
              longitude: resData[i].s_lon,
              width: 20,
              height: 30,
              callout: {
                content: resData[i].s_street + '\n有:' + goodsInfo + resData[i].s_subtime,
                // content: '测试',
                color: "#3D91ED",
                bgColor: "#FFFFFF",
                display:'BYCLICK',
                textAlign:'center'
              }
            })
            idCount = idCount + 1
          } else if (resData[i].s_type == 2){
            for(let j = 0; j < resData[i].details_info.length; j++) {
             
              goodsInfo += resData[i].details_info[j].goods_name 
            }
            newMarkers.push({
              iconPath: demandMarker,
              id: idCount+1,
              // markerId: idCount+1,
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
            idCount = idCount + 1
        }
        else if (resData[i].s_type == 3){
          for(let j = 0; j < resData[i].details_info.length; j++) {
            goodsInfo += resData[i].details_info[j].goods_name 
          }
          newMarkers.push({
            iconPath: demandMarker,
            id: idCount+1,
            // markerId: idCount+1,
            latitude: resData[i].s_lat,
            longitude: resData[i].s_lon,
            width: 20,
            height: 30,
            callout: {
              content: resData[i].s_street + '\n有' + goodsInfo + resData[i].s_subtime,
              // content: '测试',
              color: "#3D91ED",
              bgColor: "#FFFFFF",
              display:'BYCLICK',
              textAlign:'center'
            }
          })
          idCount = idCount + 1
      }
    }}}
    // console.log(newMarkers.length)
    // console.log(newMarkers)
    
    this.setState({
      markers: newMarkers
      mapScale: scale
    })
  }

  tabsClick(value) {
    // console.log(value)
    if(value == 0) {
      this.reLocation(
        () => {
          this.markerPush(0)
        }
      )
    } else if(value == 1) {
      this.reLocation(
        () => {
          this.markerPush(1)
        }
      )
    }
    this.setState({
      tabsIdx: value
    })
    // Taro.request({
    //   url: 'https://jwb.comdesignlab.com/me/1/',
    //   // url: 'http://121.43.233.66:8009/me/1/',
    //   data: JSON.stringify({
    //     u_id: getLogininfo().openid,
    //     page_items_count: 10,
    //   }),
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    //   },
    //   method: 'POST',
    // })
    // .then(res => { 
    //   this.setState({
    //     myData: res.data?res.data:[]
    //   })
    // })
  }

  // 用户手动点击地图选择位置信息（该功能准备在下一版中开放）
  getLocationByTap({ detail: { longitude, latitude } }: MapProps) {
    console.log('你点击的位置是： ' + '[ ' + longitude + ', ' + latitude + ' ]')
  }

  // 刷新用户当前的位置信息
  refreshLoation() {    
    this.getLocationInfo()
  }

  imgclick(){
    this.setState({
      modalShow:true
    })
  }

  // tabsClick(value) {
  //   this.setState({
  //     tabsIdx: value
  //   })
  // }
  handleClose(){this.setState({
    modalShow:false
  })}
  handleCancel(){this.setState({
    modalShow:false
  })}
  handleConfirm(){Taro.redirectTo({ url: `/pages/home_life/index` })}

  render() {
    const { keyword, tabBarIdx, markers, tabsIdx, latitude, longitude, address, mapScale } = this.state
    //this.markerPush()

    
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
          <View className='top'>
          <Image
              className='icon'
              src={medical2life}
              onClick={this.imgclick.bind(this)}
              
              
          />
          <AtSearchBar
            value={keyword}
            onChange={this.searchChange.bind(this)}
            className='p-search-bar' 
          />
          </View>
        }>
          <AtModal
            className='switchModal'
            isOpened={this.state.modalShow}
            cancelText='否'
            confirmText='是'
            onClose={ this.handleClose.bind(this) }
            onCancel={ this.handleCancel.bind(this) }
            onConfirm={ this.handleConfirm.bind(this) }
            content={this.state.modalContent}
            
/>

        <Map
          markers={markers}
          latitude={latitude}
          longitude={longitude}
          scale={mapScale}
          className='p-map'
          onCalloutTap={this.goThere}
          // onClick={this.getLocationByTap.bind(this)} //在地图中手动选择位置（预留在下一版app中开放）
          // onClick={this.getDistance.bind(this)} //测试计算距离
        >
          
          <CoverImage
              className='refresh'
              src={refreshButton}
              onClick={this.refreshLoation.bind(this)} 
          />
          
        </Map>

        <view style={{display:"none", justifyContent:'center'}}>
         <CoverImage src={scrollUpIco} style='width:25px; height:20px;position:absolute;top:40%;left:46%' ></CoverImage></view>

        <AtTabs 
          className='p-tabs' current={tabsIdx} tabList={this.tabList} 
          onClick={this.tabsClick.bind(this)}>
          {/* 最新 */}
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={0}>
          {
            this.state.newestData.map((item, index) => {
              return (
                <WMessageItem 
                  key = {index}
                  itemData = {item}
                  style='border-bottom: 3rpx solid #666'
                  distance = {this.state.newestdistances[index]}
                  showdistance={true}
                  >
                </WMessageItem>
              )
            })
          }
          </AtTabsPane>
          {/* 附近 */}
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={1}>
            {
              this.state.resData.map((item, index) => {
                return (
                  <WMessageItem 
                    key = {index}
                    itemData = {item}
                    style='border-bottom: 3rpx solid #666'
                    distance = {this.state.neardistances[index]}
                    showdistance={true}
                    >
                  </WMessageItem>
                )
              })
            }
          </AtTabsPane>
          {/* 我的 */}
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={2}>
          {
              this.state.myData.map((item, index) => {
                return (
                  <WMessageItem 
                    key = {index}
                    itemData = {item}
                    style='border-bottom: 3rpx solid #666'
                    distance = {{distance: 0}}
                    showdistance={false}
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
