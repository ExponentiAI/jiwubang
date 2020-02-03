import Taro, { Component, Config } from '@tarojs/taro'
import { MapProps } from '@tarojs/components/types/Map'
import { View, Text, Image, Navigator, Button, Map } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction, AtTabBar, AtSearchBar, AtTabs, AtTabsPane, AtDivider } from 'taro-ui'
import { UPage } from '../../components/ui'
import { WTab, WMessageItem } from '../../components/widget'
import './index.less'
import http from '../../libs/http'
import api from '../../api/api'

let isWapp = process.env.TARO_ENV;


export interface State {
  open: boolean;
  homeData: any;
  tabBarIdx: number;
  keyword: string;
  tabsIdx: number;
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
      tabsIdx: 0
    }
  }

  componentWillMount() {
    Taro.showShareMenu()
      .then(
        () => {
          this.onShareAppMessage
        }
      )
  }
  onShareAppMessage(res) {
    // 这是分享配置
    return {
      title: '老板记账  收支更清晰',
      path: '/pages/index/index',
      // imageUrl: source.shareImage,
    }
  }

  tabList = [{ title: '热门' }, { title: '最新' }, { title: '我的' }]

  homeInfo() {
    // 网络http请求示例
    http.request(api.getUser)
      .then((res: any) => {
        if (res.success) {
          this.setState({
          }, () => {
            // ...
          })
        }
      })
  }
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
    const { keyword, tabBarIdx, open, tabsIdx } = this.state

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
          onClick={this.mapClick.bind(this)}
          className='p-map'
        />

        <AtTabs className='p-tabs' current={tabsIdx} tabList={this.tabList} onClick={this.tabsClick.bind(this)}>
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={0} >
            <WMessageItem></WMessageItem>
            <WMessageItem></WMessageItem>
            <WMessageItem style='border-bottom: none'></WMessageItem>
            <AtDivider content='没有更多了' />
          </AtTabsPane>
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={1}>
            <WMessageItem></WMessageItem>
            <AtDivider content='没有更多了' />
          </AtTabsPane>
          <AtTabsPane className='p-tabs-pane' current={tabsIdx} index={2}>
            <WMessageItem style='border-bottom: none'></WMessageItem>
            <AtDivider content='没有更多了' />
          </AtTabsPane>
        </AtTabs>

        {
          isWapp === 'weapp' ?
            <AtModal isOpened={open} closeOnClickOverlay={false}>
              <AtModalContent>
                为了您更好的体验小程序，建议您授权微信获取用户信息
            </AtModalContent>
              <AtModalAction>
                <Button className='button-gray' onClick={() => {
                  this.setState({
                    open: false
                  })
                }}>取消</Button>
                <Button openType='getUserInfo' onGetUserInfo={() => {
                  this.setState({
                    open: false
                  })
                }}>获取授权</Button>
              </AtModalAction>
            </AtModal> : ''
        }
        {/* <AtTabBar
          fixed
          tabList={[
            { title: '信息求助', iconType: 'bullet-list', text: 'new' },
            { title: '信息提供', iconType: 'camera' }
          ]}
          onClick={this.tabbarClick.bind(this)}
          current={tabBarIdx}
        /> */}
      </UPage>
    )
  }
}