import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

class JoinSchedule extends Component {
    config: Config = {
        navigationBarTitleText: "加入班表"
    };

    render() {
        return (
            <View className="index">
                <View>
                    <Text>这里是加入班表页面</Text>
                    <Text>进来的时候链接应该带有一个 schedule ID</Text>
                    <Text>所以先去后端把这场 schedule 的数据抓回来存到 store 的 scheduleData</Text>
                    <Text>然后用户进到这里的时候 store 的 userData 应该没有东西</Text>
                    <Text>因为他是点击某个邀请链接进来这里的</Text>
                    <Text>所以先帮他办理授权登入</Text>
                    <Text>然后把他的用户信息送回来</Text>
                </View>
                <View>
                    <Text>用户从这个页面可以做这些事情</Text>
                    <Text>1. 加入某个班表</Text>
                </View>
            </View>
        );
    }
}

export default JoinSchedule as ComponentClass;
