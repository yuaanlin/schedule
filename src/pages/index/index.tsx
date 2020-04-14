import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

class Index extends Component {
    config: Config = {
        navigationBarTitleText: "首页"
    };

    render() {
        return (
            <View className="index">
                <View>
                    <Text>这里是首页，用户刚进来会先被要求登入（或验证登陆）</Text>
                    <Text>登入成功后，后端发送这个用户的这些信息：</Text>
                    <Text>1. 个人信息</Text>
                    <Text>2. 创立的班表信息</Text>
                    <Text>3. 参加的班表信息</Text>
                    <Text>到小程序并储存到 store 的 userData 中</Text>
                </View>
                <View>
                    <Text>用户从这个页面可以做这些事情</Text>
                    <Text>1. 点击进入自己创建的班表</Text>
                    <Text>2. 点击进入自己参加的班表</Text>
                    <Text>3. 创建新的班表</Text>
                </View>
            </View>
        );
    }
}

export default Index as ComponentClass;
