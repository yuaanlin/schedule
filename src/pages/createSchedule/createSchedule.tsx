import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

class CreateSchedule extends Component {
    config: Config = {
        navigationBarTitleText: "首页"
    };

    render() {
        return (
            <View className="index">
                <View>
                    <Text>这里是创建班表页面</Text>
                    <Text>用户进到这里的时候 store 的 userData 应该已经有东西了</Text>
                    <Text>保险起见还是做一个检查，若没有的话还是帮他先做个登入</Text>
                </View>
                <View>
                    <Text>用户从这个页面可以做这些事情</Text>
                    <Text>1. 创建新的班表</Text>
                </View>
            </View>
        );
    }
}

export default CreateSchedule as ComponentClass;
