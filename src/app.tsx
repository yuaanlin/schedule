import Taro, { Component, Config } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import Index from "./pages/index";

import "./app.scss";
import "./assets/icon/iconfont.scss"
import './custom-theme.scss'
import store from "./redux/store";

class App extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        pages: ["pages/index/index", "pages/createSchedule/createSchedule", "pages/scheduleDetail/scheduleDetail","pages/Individual/individual","pages/suggest/suggest","pages/aboutus/aboutus","pages/joinSchedule/joinSchedule"],
        window: {
          backgroundTextStyle: "light",
          navigationBarBackgroundColor: "#ABCFD0",
          navigationBarTitleText: "轻排班",
          enablePullDownRefresh:true
          // navigationBarTextStyle: "black",
        },
    };

    componentDidMount() {
        Taro.cloud.init();
    }

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store}>
                <Index />
            </Provider>
        );
    }
}

Taro.render(<App />, document.getElementById("app"));
