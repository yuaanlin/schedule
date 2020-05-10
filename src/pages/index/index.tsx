import { Button, Text, View } from "@tarojs/components";
import { connect, Provider } from "@tarojs/redux";
import Taro, { Component, Config } from "@tarojs/taro";
import { AtAccordion, AtCard, AtFab, AtList, AtSearchBar, AtTabBar, AtTabs, AtTabsPane } from "taro-ui";
import Banci from "../../classes/banci";
import info from "../../classes/info";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import { updateBanci } from "../../redux/actions/banci";
import { updateInfo } from "../../redux/actions/info";
import { updateSchedule } from "../../redux/actions/schedule";
import { setUserData } from "../../redux/actions/user";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import { getPerscheResult, loginResult, postUserInfoResult } from "../../types";
import getDateString from "../../utils/getDateString";
import "./index.scss";

/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
    bancis: Array<Banci>;
    infos: Array<info>;
    setUserData: (user: User) => void;
    updateSchedule: (Schedule: Schedule) => void;
    updateBanci: (banci: Banci) => void;
    updateInfo: (info: info) => void;
};

type States = {
    current: number;
    tabcurrent: number;
    searchvalue: string;
    openunfinished: boolean;
    openfinished: boolean;
    openfailed: boolean;
    openunset: boolean;
};

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
    return {
        user: state.user,
        schedules: state.schedules,
        bancis: state.bancis,
        infos: state.infos
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
        },
        updateBanci: (banci: Banci) => {
            dispatch(updateBanci(banci));
        }
    };
}

/** 首页 */
class Index extends Component<Props, States> {
    config: Config = {
        navigationBarTitleText: "排了个班"
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
                            if (resdata.result.code === 200) {
                                resdata.result.schedules.map(sche => {
                                    this.props.updateSchedule(sche);
                                });
                                resdata.result.infos.map(info => {
                                    this.props.updateInfo(info);
                                });
                                resdata.result.bancis.map(banci => {
                                    this.props.updateBanci(banci);
                                });
                            }
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

    handlebarClick(value: number) {
        this.setState({
            tabcurrent: value
        });
        if (value == 1) {
            Taro.redirectTo({
                url: "../Individual/individual"
            });
        }
    }

    constructor() {
        super(...arguments);
        this.state = {
            current: 0,
            tabcurrent: 0,
            searchvalue: "",
            openunfinished: true,
            openfinished: true,
            openfailed: true,
            openunset: true
        };
    }
    render() {
        /** 我参加的班表 */
        var joinedSches = new Array<Schedule>();
        this.props.schedules.map(sche => {
            if (sche.ownerID !== this.props.user._id && sche.attenders.includes(this.props.user._id)) {
                joinedSches.push(sche);
            }
        });

        /** 我组织的班表 */
        var ownedSches = new Array<Schedule>();
        this.props.schedules.map(sche => {
            if (sche.ownerID === this.props.user._id) {
                ownedSches.push(sche);
            }
        });
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
            <Provider store={store}>
                <AtSearchBar value={this.state.searchvalue} onChange={value => this.setState({ searchvalue: value })} />
                <AtTabs current={this.state.current} tabList={tabList} onClick={value => this.setState({ current: value })}>
                    <AtTabsPane current={this.state.current} index={0}>
                        <View>
                            <AtAccordion
                                open={this.state.openunset}
                                onClick={value => this.setState({ openunset: value })}
                                title="组织中的排班"
                            >
                                <AtList hasBorder={false}>
                                    {ownedSches
                                        .filter(sc => !sc.complete)
                                        .filter(sc => (this.state.searchvalue === "" ? true : sc.title.includes(this.state.searchvalue)))
                                        .map(item => {
                                            let start = getDateString(item.startact, true);
                                            let end = getDateString(item.endact, true);
                                            return (
                                                <AtCard
                                                    key={item._id}
                                                    note={start + " 到 " + end}
                                                    title={item.title}
                                                    extra="填写人数"
                                                    onClick={() => {
                                                        Taro.navigateTo({
                                                            url: "../joinSchedule/joinSchedule?_id=" + item._id
                                                        });
                                                    }}
                                                />
                                            );
                                        })}
                                </AtList>
                            </AtAccordion>
                            <AtAccordion
                                open={this.state.openunfinished}
                                onClick={value => this.setState({ openunfinished: value })}
                                title="进行中的排班"
                            >
                                <AtList hasBorder={false}>
                                    {ownedSches
                                        .filter(sc => sc.complete)
                                        .filter(sc => sc.endact.getTime() > new Date().getTime())
                                        .filter(sc => (this.state.searchvalue === "" ? true : sc.title.includes(this.state.searchvalue)))
                                        .map(item => {
                                            let start = getDateString(item.startact, true);
                                            let end = getDateString(item.endact, true);
                                            return (
                                                <AtCard
                                                    key={item._id}
                                                    note={start + " 到 " + end}
                                                    title={item.title}
                                                    extra="填写人数"
                                                    onClick={() => {
                                                        Taro.navigateTo({
                                                            url: "../scheduleDetail/scheduleDetail?_id=" + item._id
                                                        });
                                                    }}
                                                />
                                            );
                                        })}
                                </AtList>
                            </AtAccordion>
                        </View>
                        <View>
                            <AtAccordion
                                open={this.state.openfinished}
                                onClick={value => this.setState({ openfinished: value })}
                                title="已结束的排班"
                            >
                                <AtList hasBorder={false}>
                                    {ownedSches
                                        .filter(sc => sc.complete)
                                        .filter(sc => sc.endact.getTime() < new Date().getTime())
                                        .filter(sc => (this.state.searchvalue === "" ? true : sc.title.includes(this.state.searchvalue)))
                                        .map(item => {
                                            let start = getDateString(item.startact, true);
                                            let end = getDateString(item.endact, true);
                                            return (
                                                <AtCard
                                                    key={item._id}
                                                    note={start + " 到 " + end}
                                                    title={item.title}
                                                    extra="填写人数"
                                                    onClick={() => {
                                                        Taro.navigateTo({
                                                            url: "../scheduleDetail/scheduleDetail?_id=" + item._id
                                                        });
                                                    }}
                                                />
                                            );
                                        })}
                                </AtList>
                            </AtAccordion>
                        </View>
                    </AtTabsPane>

                    <AtTabsPane current={this.state.current} index={1}>
                        <View>
                            <AtAccordion
                                open={this.state.openunset}
                                onClick={value => this.setState({ openunset: value })}
                                title="组织中的排班"
                            >
                                <AtList hasBorder={false}>
                                    {joinedSches
                                        .filter(sc => !sc.complete)
                                        .filter(sc => (this.state.searchvalue === "" ? true : sc.title.includes(this.state.searchvalue)))
                                        .map(item => {
                                            let start = getDateString(item.startact, true);
                                            let end = getDateString(item.endact, true);
                                            return (
                                                <AtCard
                                                    key={item._id}
                                                    note={start + " 到 " + end}
                                                    title={item.title}
                                                    extra="填写人数"
                                                    onClick={() => {
                                                        Taro.navigateTo({
                                                            url: "../joinSchedule/joinSchedule?_id=" + item._id
                                                        });
                                                    }}
                                                />
                                            );
                                        })}
                                </AtList>
                            </AtAccordion>
                        </View>
                        <View>
                            <AtAccordion
                                open={this.state.openunfinished}
                                onClick={value => this.setState({ openunfinished: value })}
                                title="进行中的排班"
                            >
                                <AtList hasBorder={false}>
                                    {ownedSches
                                        .filter(sc => sc.complete)
                                        .filter(sc => sc.endact.getTime() > new Date().getTime())
                                        .filter(sc => (this.state.searchvalue === "" ? true : sc.title.includes(this.state.searchvalue)))
                                        .map(item => {
                                            let start = getDateString(item.startact, true);
                                            let end = getDateString(item.endact, true);
                                            return (
                                                <AtCard
                                                    key={item._id}
                                                    note={start + " 到 " + end}
                                                    title={item.title}
                                                    extra="填写人数"
                                                    onClick={() => {
                                                        Taro.navigateTo({
                                                            url: "../scheduleDetail/scheduleDetail?_id=" + item._id
                                                        });
                                                    }}
                                                />
                                            );
                                        })}
                                </AtList>
                            </AtAccordion>
                        </View>
                        <View>
                            <AtAccordion
                                open={this.state.openfinished}
                                onClick={value => this.setState({ openfinished: value })}
                                title="已结束的排班"
                            >
                                <AtList hasBorder={false}>
                                    {ownedSches
                                        .filter(sc => sc.complete)
                                        .filter(sc => sc.endact.getTime() < new Date().getTime())
                                        .filter(sc => (this.state.searchvalue === "" ? true : sc.title.includes(this.state.searchvalue)))
                                        .map(item => {
                                            let start = getDateString(item.startact, true);
                                            let end = getDateString(item.endact, true);
                                            return (
                                                <AtCard
                                                    key={item._id}
                                                    note={start + " 到 " + end}
                                                    title={item.title}
                                                    extra="填写人数"
                                                    onClick={() => {
                                                        Taro.navigateTo({
                                                            url: "../scheduleDetail/scheduleDetail?_id=" + item._id
                                                        });
                                                    }}
                                                />
                                            );
                                        })}
                                </AtList>
                            </AtAccordion>
                        </View>
                    </AtTabsPane>
                </AtTabs>
                <AtTabBar
                    fixed
                    tabList={[
                        { iconPrefixClass: "icon", iconType: "category", title: "" },
                        { iconPrefixClass: "icon", iconType: "usercenter", title: "" }
                    ]}
                    onClick={this.handlebarClick.bind(this)}
                    current={this.state.tabcurrent}
                ></AtTabBar>
                <View className="post-button">
                    <AtFab onClick={this.createsche}>
                        <Text className="at-fab__icon at-icon at-icon-add"></Text>
                    </AtFab>
                </View>
            </Provider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
