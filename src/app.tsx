import Taro, { Component, Config, login } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import {View,Button} from '@tarojs/components'
import Index from './pages/index'

import configStore from './store'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {
  }

  componentDidHide () {}

  componentDidCatchError () {}

  login () {
    console.log("!")
    Taro.cloud
        .callFunction({
          name:'login',
        })
        .then(res=>{
          console.log('User\'s information:',res)
          // this.setState({
          //   userInfo:res.result
          // })
        })
        .catch(console.log)
  }
  getUserInfo(e) {
    console.log(e)
    const { detail } = e
    if (detail.errMsg.endsWith('ok')) {
      const userInfo = JSON.parse(detail.rawData)
      const { nickName, gender, avatarUrl } = userInfo
      Taro.cloud
        .callFunction({
          name: 'postUserInfo',
          data: {
            name: nickName,
            gender: gender,
            avatarUrl: avatarUrl,
          },
        })
        .then(res => {
          this.setState({
            context: res.result,
          })
          this.login()
        })
    }
  }


  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
        <View className="index">
        <Button
          openType="getUserInfo"
          onGetUserInfo={this.getUserInfo}
        >
          授权
        </Button>

      </View>
      </Provider>

    )
  }
}

Taro.render(<App />, document.getElementById('app'))
