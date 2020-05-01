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
        pages: ["pages/index/index", "pages/createSchedule/createSchedule", "pages/scheduleDetail/scheduleDetail","pages/Individual/individual"],
        window: {
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#c0dbdc",
            navigationBarTitleText: "WeChat",
            navigationBarTextStyle: "black"
        },
        // tabBar:{
        //   "color": "#ccc",
        //   "selectedColor": "#35495e",
        //   "borderStyle": "white",
        //   "backgroundColor": "#f9f9f9",

        //   list:[
        //     {
        //       "text":"我的排班",
        //       "pagePath":"pages/index/index",
        //       "iconPath":"assets/image/list1",
        //       "selectedIconPath": "assets/image/list2"
        //     },{
        //       "text":"个人界面",
        //       "pagePath":"pages/Individual/individual"
        //     }
        //   ]
        // }
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
