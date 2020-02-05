import Taro from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import Component from '../../common/component'
import './index.scss'
import { getStyle } from '../../../common/utils'
import { UEmpty } from '../'

interface Props {
  className?: string;
  renderTop?: JSX.Element;
  renderBottom?: JSX.Element;
  onScroll?(event): void;
  titleImmerse?: boolean;
  showBottom?: boolean;
  empty?: boolean;
};
interface State {
  transparent: number;
  mainPaddingTop: string;
  mainPaddingBottom: string;
}

export default class Page extends Component<Props, State>{
  state: State = {
    transparent: Number(!this.props.titleImmerse),
    mainPaddingTop: '0px',
    mainPaddingBottom: '0px'
  }
  componentDidMount() {
    this.setMainStyle();
  }
  setMainStyle() {
    if (!this.props.titleImmerse) {
      let paddingTop: string
      let paddingBottom: string
      if (process.env.TARO_ENV === 'h5') {
        paddingTop = getStyle(this.top.vnode.dom, 'height')
        paddingBottom = this.bottom ? getStyle(this.bottom.vnode.dom, 'height') : '0px'
        this.setState({
          mainPaddingTop: paddingTop,
          mainPaddingBottom: paddingBottom
        })
      } else {
        this.top.fields({ size: true }, (res) => {
          paddingTop = res.height + 'px'
          this.setState({
            mainPaddingTop: paddingTop
          })
        }).exec();
        this.bottom && this.bottom.fields({ size: true }, (res) => {
          if (res) {
            paddingBottom = res.height + 'px'
            this.setState({
              mainPaddingBottom: paddingBottom
            })
          }
        }).exec();
      }
    }
  }

  prefix = 'u-page'
  top;
  bottom;
  main;

  get onePxTransparent() {
    return 1 / 100
  }
  onScroll = (event) => {
    this.props.onScroll && this.props.onScroll(event);
    // 沉浸式
    if (this.props.titleImmerse) {
      const transparent = Math.min(1, this.onePxTransparent * event.detail.scrollTop)
      this.setState({
        transparent
      });
    }
  }
  render() {
    const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight
    const { mainPaddingTop, mainPaddingBottom } = this.state
    const { titleImmerse, empty } = this.props

    return (
      <View className={`${this.prefix} ${this.props.className}`}>
        <View
          ref={(c) => this.top = c}
          style={{
            paddingTop: statusBarHeight + 'px',
            backgroundColor: titleImmerse ? `rgba(255, 255, 255, 0)` : undefined,
            // borderColor: `rgba(209, 225, 237, ${this.state.transparent})`
          }}
          className={this.prefix + '-top'}
        >
          {this.props.renderTop}
        </View>
        <ScrollView
          style={{ paddingTop: mainPaddingTop, paddingBottom: mainPaddingBottom }}
          ref={(c) => this.main = c}
          scrollY
          className={this.prefix + '-main'}
          onScroll={this.props.onScroll}
        >
          {empty ? <UEmpty style='padding-top: 200px' /> : this.props.children}
        </ScrollView>

        {
          this.props.showBottom && <View ref={(c) => this.bottom = c} className={`${this.prefix}-bottom`}>{this.props.renderBottom}</View>
        }
      </View>
    );
  }
}
