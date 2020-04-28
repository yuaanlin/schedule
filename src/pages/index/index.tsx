import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtList, AtListItem, AtFab } from "taro-ui";
import "./index.scss";
import User from "../../classes/user";
import { connect } from "@tarojs/redux";
import { setUserData } from "../../redux/actions/user";

/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    setUserData: (user: User) => void;
};

type States = {
    current: number;
};

/** 把 Store 里面这个页面需要的 States 和 Actions 放入 Props */
@connect(
    ({ user, setUserData }) => ({
        user: user,
        setUserData
    }),
    dispatch => ({
        setUserData: (user: User) => dispatch(setUserData(user))
    })
)

/** 首页 */
class Index extends Component<Props, States> {
    config: Config = {
        navigationBarTitleText: "首页"
    };

    getUserInfo(e: any) {
        Taro.cloud.init();
        const { detail } = e;
        if (detail.errMsg.endsWith("ok")) {
            Taro.cloud
                .callFunction({
                    name: "postUserInfo"
                })
                .then(res => {
                    var resdata = (res as unknown) as getUserDataResponse;
                    Taro.showToast({ title: "登入成功", icon: "success", duration: 2000 });
                    this.props.setUserData(new User(resdata.result.openid));
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
        /** 尚未登入 */
        if (this.props.user.id === "") {
            return (
                <View style={{ textAlign: "center", padding: "36px" }}>
                    <Text>请先登入才能使用小程序的完整功能哦！</Text>
                    <Button style={{ marginTop: "60px" }} openType="getUserInfo" onGetUserInfo={this.getUserInfo}>
                        透过微信授权登入
                    </Button>
                </View>
            );
        }

        /** 已经登入 */
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
            </View>
        );
    }
}

interface getUserDataResponse {
    errMsg: string;
    requestID: string;
    result: {
        appid: string;
        openid: string;
    };
}

export default Index as ComponentClass;
