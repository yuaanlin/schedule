import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtList, AtListItem, AtFab } from "taro-ui";
import "./index.scss";

interface States {
    current: number;
}

class Index extends Component<Readonly<{}>, States> {
    config: Config = {
        navigationBarTitleText: "首页"
    };

    login() {
        Taro.cloud
            .callFunction({
                name: "login"
            })
            .then(res => {
                console.log("User's information:", res.result);
            })
            .catch(console.log);
    }

    getUserInfo(e) {
        Taro.cloud.init();
        const { detail } = e;
        if (detail.errMsg.endsWith("ok")) {
            const userInfo = JSON.parse(detail.rawData);
            const { nickName, gender, avatarUrl } = userInfo;
            Taro.cloud
                .callFunction({
                    name: "postUserInfo",
                    data: {
                        name: nickName,
                        gender: gender,
                        avatarUrl: avatarUrl
                    }
                })
                .then(res => {
                    console.log(res);
                    this.login();
                });
        }
    }

    constructor() {
        super(...arguments);
        this.state = {
            current: 0
        };
    }

    createsche() {
        Taro.navigateTo({
            url: "../createSchedule/createSchedule"
        });
    }

    handleClick(value: number) {
        this.setState({
            current: value
        });
    }
    getDetail(){
      Taro.cloud
          .callFunction({
            name:'getschedule',
            data:{
              scheid:'17b0c7775e9dbba4008c8f8d6a8cf2c1',
            },
          })
          Taro.navigateTo({
            url:'../scheduleDetail/scheduleDetail'
          })
    }
    render() {
        const tabList = [{ title: "我组织的" }, { title: "我参与的" }];
        return (
            <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
                <AtTabsPane current={this.state.current} index={0}>
                    <AtList>
                        <AtListItem arrow="right" note="description" title="活动title" extraText="" onClick={this.getDetail} />
                    </AtList>
                    <Button openType="getUserInfo" onGetUserInfo={this.getUserInfo}>
                        授权
                    </Button>
                    <View className="post-button">
                        <AtFab onClick={this.createsche}>
                            <Text className="at-fab__icon at-icon at-icon-add"></Text>
                        </AtFab>
                    </View>
                </AtTabsPane>

                <AtTabsPane current={this.state.current} index={1}>
                    <View style="padding: 100px 50px;background-color: #FAFBFC;text-align: center;">标签页二的内容</View>
                </AtTabsPane>
            </AtTabs>
        );
    }
}

export default Index as ComponentClass;
