import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/home/index'
import 'taro-ui/dist/style/index.scss'
import './app.scss'
import '@tarojs/async-await'






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
      'pages/home/index',  // 首页
      'pages/demand/index',  // 信息提供
      'pages/help/index',  // 信息求助
      'pages/about/index',  //关于页面
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示" // 高速公路行驶持续后台定位
      }
    }
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
