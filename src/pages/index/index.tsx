import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtList, AtListItem, AtFab } from "taro-ui";
import "./index.scss";
import User from "../../classes/user";
import Schedule from "../../classes/schedule";
import info from "../../classes/info";
import { connect } from "@tarojs/redux";
import { setUserData } from "../../redux/actions/user";
import { updateSchedule } from "../../redux/actions/schedule";
import { loginResult, getPerscheResult, postUserInfoResult } from "../../types";
import { updateInfo } from "../../redux/actions/info";
import { AppState } from "src/redux/types";
import store from "src/redux/store";

/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
    setUserData: (user: User) => void;
    updateSchedule: (Schedule: Schedule) => void;
    updateInfo: (info: info) => void;
};

type States = {
    current: number;
};

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
    return {
        user: state.user,
        schedules: state.schedules
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
        setUserData: (user: User) => {
            dispatch(setUserData(user));
        },
        updateSchedule: (schedule: Schedule) => {
            dispatch(updateSchedule(schedule));
        },
        updateInfo: (info: info) => {
            dispatch(updateInfo(info));
        }
    };
}

/** 首页 */
class Index extends Component<Props, States> {
    config: Config = {
        navigationBarTitleText: "首页"
    };

    componentDidMount() {
        Taro.cloud.init();
        Taro.cloud
            .callFunction({
                name: "login"
            })
            .then(res => {
                var resdata = (res as unknown) as loginResult;
                if (resdata.result.code === 200) {
                    this.props.setUserData(new User(resdata.result.user));
                    Taro.cloud
                        .callFunction({
                            name: "getPersche"
                        })
                        .then(res => {
                            var resdata = (res as unknown) as getPerscheResult;
                            resdata.result.schedules.map(sche => {
                                this.props.updateSchedule(sche);
                            });
                            resdata.result.infos.map(info => {
                                this.props.updateInfo(info);
                            });
                        });
                }
            });
    }

    getUserInfo(e: any) {
        Taro.cloud.init();
        const { detail } = e;
        Taro.cloud
            .callFunction({
                name: "postUserInfo",
                data: {
                    name: detail.userInfo.nickName,
                    avatarUrl: detail.userInfo.avatarUrl,
                    gender: detail.userInfo.gender
                }
            })
            .then(res => {
                var resdata = (res as unknown) as postUserInfoResult;
                Taro.showToast({ title: "登入成功", icon: "success", duration: 2000 });
                this.props.setUserData(new User(resdata.result.data));
            });
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

    getDetail(_id: String) {
        Taro.cloud.callFunction({
            name: "getschedule",
            data: {
                scheid: _id
            }
        });
        Taro.navigateTo({
            url: "../scheduleDetail/scheduleDetail?_id=${_id}"
        });
    }

    render() {
        /** 尚未登入 */
        if (this.props.user._id === "") {
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
                    <View style={{ paddingBottom: "80px" }}>
                        <AtList>
                            {this.props.schedules
                                .filter(sc => sc.ownerID === this.props.user._id)
                                .map(item => {
                                    return (
                                        <AtListItem
                                            key={item._id}
                                            arrow="right"
                                            note={item.description}
                                            title={item.title}
                                            extraText=""
                                            onClick={() => {
                                                this.getDetail(item._id);
                                            }}
                                        />
                                    );
                                })}
                        </AtList>
                        <View className="post-button">
                            <AtFab onClick={this.createsche}>
                                <Text className="at-fab__icon at-icon at-icon-add"></Text>
                            </AtFab>
                        </View>
                    </View>
                </AtTabsPane>

                <AtTabsPane current={this.state.current} index={1}>
                    <AtList>
                        {this.props.schedules
                            .filter(sc => sc.ownerID !== this.props.user._id && sc.attenders.includes(this.props.user._id))
                            .map(item => {
                                return (
                                    <AtListItem
                                        key={item._id}
                                        arrow="right"
                                        note={item.description}
                                        title={item.title}
                                        extraText=""
                                        onClick={() => {
                                            this.getDetail(item._id);
                                        }}
                                    />
                                );
                            })}
                    </AtList>
                </AtTabsPane>
            </AtTabs>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
