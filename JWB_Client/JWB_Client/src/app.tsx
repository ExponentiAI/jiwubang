import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import 'taro-ui/dist/style/index.scss'
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentWillMount () {
    // Taro.hideTabBar()
  }
  config: Config = {
    pages: [
      'pages/index/index',  // 信息求助
      'pages/list/index',  // 信息提供
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      color: '#bbc0ca',
      selectedColor: '1f83e1',
      backgroundColor: '#feffff',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/index/index',
          iconPath: 'assets/images/icon/report-ico1.png',
          selectedIconPath: 'assets/images/icon/report-ico2.png',
          text: '信息求助',
        },
        {
          pagePath: 'pages/list/index',
          iconPath: 'assets/images/icon/bill-ico1.png',
          selectedIconPath: 'assets/images/icon/bill-ico2.png',
          text: '信息提供',
        },
      ],
    },
  }

  componentDidMount () {
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
        <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
