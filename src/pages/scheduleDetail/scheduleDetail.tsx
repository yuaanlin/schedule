import { Button, Picker, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component, Config } from "@tarojs/taro";
import {
    AtAccordion,
    AtBadge,
    AtButton,
    AtDivider,
    AtIcon,
    AtInput,
    AtList,
    AtListItem,
    AtModal,
    AtModalAction,
    AtModalContent,
    AtModalHeader,
    message
} from "taro-ui";
import Banci from "../../classes/banci";
import info from "../../classes/info";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import newinfo from "../../classes/newinfo";
import { updateBanci } from "../../redux/actions/banci";
import { updateInfo } from "../../redux/actions/info";
import { updateSchedule } from "../../redux/actions/schedule";
import { updatenewInfo } from "../../redux/actions/newinfo";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import { updatescheResult, updateTagResult } from "../../types";
import getDateFromString from "../../utils/getDateFromString";
import getDateString from "../../utils/getDateString";
import getTimeString from "../../utils/getTimeString";

/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
    bancis: Array<Banci>;
    infos: Array<info>;
    newinfos: Array<newinfo>;
    updateSchedule: (Schedule: Schedule) => void;
    updateBanci: (banci: Banci) => void;
    updateInfo: (info: info) => void;
    updatenewInfo: (newinfo: newinfo) => void;
};

type States = {
    schedule: Schedule;
    bancis: Array<Banci>;
    infos: Array<info>;
    newinfos: Array<newinfo>;

    openbanci: boolean;

    // 当前编辑的班表信息
    editing: string | undefined;

    // 暂存输入的内容
    inputingText: string;
    inputingDate: Date;

    // 当前开启 modal 的班表 id
    openmodal: string | undefined;

    openattenders: boolean;

    openinfo: string;

    tag: string;
};

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
    return {
        user: state.user,
        schedules: state.schedules,
        bancis: state.bancis,
        infos: state.infos,
        newinfos: state.newinfos
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
        updateSchedule: (schedule: Schedule) => {
            dispatch(updateSchedule(schedule));
        },
        updateBanci: (banci: Banci) => {
            dispatch(updateBanci(banci));
        },
        updateInfo: (info: info) => {
            dispatch(updateInfo(info));
        },
        updatenewInfo: (newinfo: newinfo) => {
            dispatch(updatenewInfo(newinfo));
        }
    };
}

class ScheduleDetail extends Component<Props, States> {
    constructor(props: Readonly<Props> | undefined) {
        super(props);
        this.state = {
            schedule: new Schedule(),
            bancis: new Array<Banci>(),
            infos: new Array<info>(),
            newinfos: new Array<newinfo>(),
            openbanci: false,
            openmodal: undefined,
            editing: undefined,
            inputingText: "",
            inputingDate: new Date(),
            openattenders: true,
            openinfo: "",
            tag: ""
        };
    }

    config: Config = {
        navigationBarTitleText: "班表详情"
    };

    // tospeTime(date: Date) {
    //     date = new Date(date);
    //     var Month = date.getMonth() + 1;
    //     var Day = date.getDate();
    //     var Hour = date.getHours();
    //     var min = date.getSeconds();
    //     var M = Month < 10 ? "0" + Month + "." : Month + ".";
    //     var D = Day + 1 < 10 ? "0" + Day + " " : Day + " ";
    //     var H = Hour + 1 < 10 ? "0" + Hour + ":" : Hour + ":";
    //     var Min = min + 1 < 10 ? "0" + min : min;
    //     return M + D + H + Min;
    // }

    updateSche = (key: string, value: string | Date) => {
        var newScheData = {};
        if (key === "title") {
            newScheData = {
                ...this.state.schedule,
                title: value
            };
        } else if (key === "description") {
            newScheData = {
                ...this.state.schedule,
                description: value
            };
        } else if (key === "startact") {
            newScheData = {
                ...this.state.schedule,
                startact: value
            };
        } else if (key === "endact") {
            newScheData = {
                ...this.state.schedule,
                endact: value
            };
        }

        Taro.showToast({ title: "更新中...", icon: "loading", duration: 2000 });
        Taro.cloud.callFunction({ name: "updatesche", data: newScheData }).then(res => {
            var resdata = (res as unknown) as updatescheResult;
            if (resdata.result.code === 200) {
                this.props.updateSchedule(resdata.result.schedule);
                this.setState({ schedule: new Schedule(resdata.result.schedule), editing: undefined });
            } else {
                Taro.showToast({ title: "发生错误", icon: "none", duration: 2000 });
            }
        });
    };

    componentDidMount() {
        var scheID = this.$router.params._id;
        var sc = this.props.schedules.find(sc => sc._id === scheID);
        /** 检查当前查看的班表有没有被下载了，没有的话代表用户试图访问和他无关的班表 */
        if (sc === undefined) {
            Taro.showToast({ title: "班表不存在", icon: "none", duration: 2000 });
            Taro.navigateTo({
                url: "../index/index"
            });
        } else {
            this.setState({ schedule: sc });
            var newinfo = this.props.newinfos.filter(newinfo => newinfo.scheid === scheID);
            this.setState({ newinfos: newinfo });
            let infor = new Array<info>();
            let ban = this.props.bancis.filter(banci => {
                if (sc !== undefined && banci.scheid === sc._id) {
                    infor = this.props.infos.filter(info => {
                        return info.classid === banci._id;
                    });
                }
                return sc === undefined ? "" : banci.scheid === sc._id;
            });
            this.setState({ bancis: ban });
            this.setState({ infos: infor });
        }
        this.setState({ openbanci: true });
    }

    onShareAppMessage() {
        return {
            title: "班表详情",
            path: "/pages/scheduleDetail/scheduleDetail?_id=" + this.$router.params._id,
            success: res => {
                if (res.errMsg === "shareAppMessage:ok") {
                    Taro.showToast({ title: "分享成功", icon: "success", duration: 2000 });
                }
            },
            fail: res => {
                if (res.errMsg == "shareAppMessage:fail cancel") {
                    Taro.showToast({ title: "取消分享", icon: "none", duration: 2000 });
                } else if (res.errMsg == "shareAppMessage:fail") {
                    alert("分享失败");
                }
            }
        };
    }
    updateTag = (info: info, value: string) => {
        var scheID = this.$router.params._id;
        Taro.showToast({ title: "更新中...", icon: "loading", duration: 2000 });
        Taro.cloud
            .callFunction({
                name: "updateTag",
                data: {
                    userid: info.userid,
                    newtag: value,
                    scheid: scheID
                }
            })
            .then(res => {
                var resdata = (res as unknown) as updateTagResult;
                if (resdata.result.code === 200) {
                    resdata.result.info.map(x => this.props.updateInfo(x));
                    Taro.showToast({ title: "修改成功", icon: "success", duration: 2000 });
                } else {
                    Taro.showToast({ title: "发生错误", icon: "none", duration: 2000 });
                }
            });
    };
    render() {
        const schedule = this.state.schedule;
        // const { infos } = this.state;
        const { newinfos } = this.state;

        if (schedule === undefined) return <View>发生错误</View>;

        let ban = this.props.bancis.filter(banci => banci.scheid === schedule._id);
        // const bancis = ban;
        let infor = this.props.newinfos.filter(newinfo => {
            var bid = newinfo.classid;
            var found = false;
            ban.map(b => {
                if (b._id === bid) found = true;
            });
            return found;
        });
        return (
            <View>
                <AtList>
                    <AtListItem title={schedule.title} onClick={() => this.setState({ editing: "title", inputingText: schedule.title })} />
                    <AtListItem
                        title={schedule.description}
                        onClick={() => this.setState({ editing: "description", inputingText: schedule.description })}
                    />
                    <AtListItem
                        title={getDateString(schedule.startact, true)}
                        note="班表开始日期"
                        onClick={() => this.setState({ editing: "startact", inputingDate: schedule.startact })}
                    />
                    <AtListItem
                        title={getDateString(schedule.endact, true)}
                        note="班表结束日期"
                        onClick={() => this.setState({ editing: "endact", inputingDate: schedule.endact })}
                    />
                </AtList>
                <View style={{ marginTop: "32px" }}>
                    <AtList>
                        <AtAccordion open={this.state.openbanci} onClick={value => this.setState({ openbanci: value })} title="班次列表">
                            {/* 循环班次数据库取得所有班次信息 */}
                            {this.state.bancis.map(item => {
                                return (
                                    <View key={item._id}>
                                        <AtListItem
                                            title={
                                                getDateString(item.startTime, true) +
                                                "" +
                                                getTimeString(item.startTime, true) +
                                                " 开始的班次"
                                            }
                                            note={"共需要" + item.count.toString() + "人"}
                                            onClick={() => {
                                                this.setState({ openmodal: item._id });
                                            }}
                                        />
                                        {/* 对应listitem生成对应的modal */}
                                        <AtModal isOpened={this.state.openmodal === item._id}>
                                            <AtModalHeader>
                                                {getDateString(item.startTime, true) + "" + getTimeString(item.startTime, true) + " 的班次"}
                                            </AtModalHeader>
                                            <AtModalContent>
                                                <View className="at-row">
                                                    <View className="at-col at-col-2">
                                                        <AtIcon prefixClass="icon" value="Customermanagement"></AtIcon>
                                                    </View>
                                                    <View className="at-col at-col-6">
                                                        <Text>成员</Text>
                                                    </View>
                                                </View>
                                                {/* 循环班次成员获取tag */}
                                                <View>
                                                    {newinfos.filter(info => info.classid === item._id).length === 0 ? (
                                                        <Text>没有成员</Text>
                                                    ) : (
                                                        <View>
                                                            {newinfos.map(x => {
                                                                if (x.classid === item._id)
                                                                    return (
                                                                        <AtBadge key={item._id}>
                                                                            <AtButton size="small">{x.tag}</AtButton>
                                                                        </AtBadge>
                                                                    );
                                                            })}
                                                        </View>
                                                    )}
                                                </View>
                                                <AtDivider></AtDivider>
                                                <View className="at-row">
                                                    <View className="at-col at-col-3">
                                                        <AtIcon prefixClass="icon" value="clock"></AtIcon>
                                                    </View>
                                                    <View className="at-col at-col-6">
                                                        <View className="at-row">
                                                            {"启：" +
                                                                getDateString(item.startTime, true) +
                                                                "" +
                                                                getTimeString(item.startTime, true)}
                                                        </View>

                                                        <View className="at-row">
                                                            {"止：" +
                                                                getDateString(item.endTime, true) +
                                                                "" +
                                                                getTimeString(item.endTime, true)}
                                                        </View>
                                                    </View>
                                                </View>
                                                <AtDivider></AtDivider>
                                                <View className="at-row">
                                                    <View className="at-col at-col-2">
                                                        <AtIcon prefixClass="icon" value="suggest"></AtIcon>
                                                    </View>
                                                    <View className="at-col at-col-6">{<Text>注意事项之类的</Text>}</View>
                                                </View>
                                            </AtModalContent>
                                            <AtModalAction>
                                                <Button
                                                    onClick={() => {
                                                        this.setState({ openmodal: undefined });
                                                    }}
                                                >
                                                    返回
                                                </Button>
                                            </AtModalAction>
                                        </AtModal>
                                    </View>
                                );
                            })}
                        </AtAccordion>
                    </AtList>
                    <AtList>
                        <AtAccordion
                            open={this.state.openattenders}
                            onClick={value => this.setState({ openattenders: value })}
                            title="人员列表"
                        >
                            {infor.map(item => {
                                return (
                                    <View key={item._id}>
                                        <AtListItem
                                            title={item.tag}
                                            onClick={() => {
                                                this.setState({ openinfo: item._id });
                                            }}
                                        />
                                        {/* 对应listitem生成对应的modal */}
                                        <AtModal isOpened={this.state.openinfo === item._id}>
                                            <AtModalHeader>{item.tag + " 的个人信息"} </AtModalHeader>
                                            <AtModalContent>
                                                <View className="at-row">
                                                    <View className="at-col at-col-3">
                                                        <AtIcon prefixClass="icon" value="editor"></AtIcon>
                                                    </View>
                                                    <View className="at-col at-col-6">
                                                        <Text>修改tag</Text>
                                                    </View>
                                                </View>
                                                <View className="at-row">
                                                    <View className="at-col at-col-9">
                                                        <AtInput
                                                            name="tag"
                                                            editable={
                                                                item.userid === this.props.user._id ||
                                                                this.props.user._id === schedule.ownerID
                                                                    ? true
                                                                    : false
                                                            }
                                                            value={this.state.tag}
                                                            onChange={v => {
                                                                this.setState({ tag: v.toString() });
                                                            }}
                                                        ></AtInput>
                                                    </View>
                                                    <View className="at-col at-col-3">
                                                        <AtBadge>
                                                            <AtButton size="small" onClick={() => this.updateTag(item, this.state.tag)}>
                                                                确认
                                                            </AtButton>
                                                        </AtBadge>
                                                    </View>
                                                </View>
                                                <View className="at-row">
                                                    <View className="at-col at-col-3">
                                                        <AtIcon prefixClass="icon" value="Customermanagement"></AtIcon>
                                                    </View>
                                                    <View className="at-col at-col-6">
                                                        <Text>参与班次</Text>
                                                    </View>
                                                </View>
                                                {/* 循环班次成员获取tag */}
                                                <View>
                                                    {ban.filter(x => x._id === item.classid).length === 0 ? (
                                                        <Text>没有加入任何班次</Text>
                                                    ) : (
                                                        <View>
                                                            {ban.map(x => {
                                                                let e1;
                                                                if (x._id === item.classid) {
                                                                    e1 = (
                                                                        <AtButton
                                                                            className="btn"
                                                                            key={x._id}
                                                                            onClick={() => {
                                                                                this.setState({
                                                                                    openinfo: "",
                                                                                    openmodal: x._id
                                                                                });
                                                                            }}
                                                                        >
                                                                            {getDateString(x.startTime, true) +
                                                                                "" +
                                                                                getTimeString(x.startTime, true) +
                                                                                "开始的班次"}
                                                                        </AtButton>
                                                                    );
                                                                } else {
                                                                    e1 = null;
                                                                }
                                                                return <View>{e1}</View>;
                                                            })}
                                                        </View>
                                                    )}
                                                </View>
                                            </AtModalContent>
                                            <AtModalAction>
                                                <Button onClick={() => this.setState({ openinfo: "" })}>关闭</Button>
                                            </AtModalAction>
                                        </AtModal>
                                    </View>
                                );
                            })}
                        </AtAccordion>
                    </AtList>
                </View>

                <AtModal isOpened={this.state.editing === "title"}>
                    <AtModalHeader>修改班表标题</AtModalHeader>
                    <AtModalContent>
                        <AtInput
                            name="title"
                            value={this.state.inputingText}
                            onChange={v => this.setState({ inputingText: v.toString() })}
                        ></AtInput>
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={() => this.setState({ editing: undefined })}>返回</Button>
                        <Button onClick={() => this.updateSche("title", this.state.inputingText)}>更新</Button>
                    </AtModalAction>
                </AtModal>

                <AtModal isOpened={this.state.editing === "description"}>
                    <AtModalHeader>修改班表描述</AtModalHeader>
                    <AtModalContent>
                        <AtInput
                            name="description"
                            value={this.state.inputingText}
                            onChange={v => this.setState({ inputingText: v.toString() })}
                        ></AtInput>
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={() => this.setState({ editing: undefined })}>返回</Button>
                        <Button onClick={() => this.updateSche("description", this.state.inputingText)}>更新</Button>
                    </AtModalAction>
                </AtModal>

                <AtModal isOpened={this.state.editing === "startact"}>
                    <AtModalHeader>修改班表开始日期</AtModalHeader>
                    <AtModalContent>
                        <Picker
                            style={{ margin: "12px" }}
                            value={getDateString(this.state.inputingDate, false)}
                            mode="date"
                            onChange={v => this.setState({ inputingDate: getDateFromString(v.detail.value) })}
                        >
                            <View className="picker form-value">{getDateString(this.state.inputingDate, true)}</View>
                        </Picker>
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={() => this.setState({ editing: undefined })}>返回</Button>
                        <Button onClick={() => this.updateSche("startact", this.state.inputingDate)}>更新</Button>
                    </AtModalAction>
                </AtModal>

                <AtModal isOpened={this.state.editing === "endact"}>
                    <AtModalHeader>修改班表结束日期</AtModalHeader>
                    <AtModalContent>
                        <Picker
                            style={{ margin: "12px" }}
                            value={getDateString(this.state.inputingDate, false)}
                            mode="date"
                            onChange={v => this.setState({ inputingDate: getDateFromString(v.detail.value) })}
                        >
                            <View className="picker form-value">{getDateString(this.state.inputingDate, true)}</View>
                        </Picker>
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={() => this.setState({ editing: undefined })}>返回</Button>
                        <Button onClick={() => this.updateSche("endact", this.state.inputingDate)}>更新</Button>
                    </AtModalAction>
                </AtModal>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDetail);
