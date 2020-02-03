import Taro, { Component, Config } from '@tarojs/taro'
import { MapProps } from '@tarojs/components/types/Map'
import { View, Text, Image, Navigator, Button, Map } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction, AtTabBar, AtSearchBar, AtTabs, AtTabsPane, AtDivider } from 'taro-ui'
import { UPage } from '../../components/ui'
import { WTab, WMessageItem } from '../../components/widget'
import { mapLocation } from '../../assets/images/icon'
import './index.less'

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
  markers: Array<any>,
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
      markers: []
    }
  }

  componentWillMount() {
    this.getLocation()
  }

  async getLocation() {
    const location = await Taro.getLocation({isHighAccuracy: true}) as Taro.getLocation.SuccessCallbackResult
    const latitude = location.latitude
    const longitude = location.longitude

    this.setState({
      latitude,
      longitude,
      markers: [{
        iconPath: mapLocation,
        id: 0,
        latitude,
        longitude,
        width: 50,
        height: 50
      }]
    })
  }

  tabList = [{ title: '热门' }, { title: '最新' }, { title: '我的' }]

  tabbarClick() {

  }
  searchChange() {

  }
  mapClick({ detail: { longitude, latitude } }: MapProps) {
    console.log(longitude, latitude)
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
          onClick={this.mapClick.bind(this)}
          className='p-map'
        />

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
