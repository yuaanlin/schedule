import { Button, Picker, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component, Config } from "@tarojs/taro";
import { AtAccordion, AtBadge, AtButton, AtDivider, AtIcon, AtInput, AtList, AtListItem, AtModal, AtModalAction, AtModalContent, AtModalHeader } from "taro-ui";
import Banci from "../../classes/banci";
import info from "../../classes/info";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import { updateBanci } from "../../redux/actions/banci";
import { updateInfo } from "../../redux/actions/info";
import { updateSchedule } from "../../redux/actions/schedule";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import { updatescheResult } from "../../types";
import getDateFromString from "../../utils/getDateFromString";
import getDateString from "../../utils/getDateString";

/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
    bancis: Array<Banci>;
    infos: Array<info>;
    updateSchedule: (Schedule: Schedule) => void;
    updateBanci: (banci: Banci) => void;
    updateInfo: (info: info) => void;
};

type States = {
    schedule: Schedule;
    bancis: Array<Banci>;
    infos: Array<info>;
    openbanci: boolean;

    // 当前编辑的班表信息
    editing: string | undefined;

    // 暂存输入的内容
    inputingText: string;
    inputingDate: Date;

    // 当前开启 modal 的班表 id
    openmodal: string | undefined;
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
        updateSchedule: (schedule: Schedule) => {
            dispatch(updateSchedule(schedule));
        },
        updateBanci: (banci: Banci) => {
            dispatch(updateBanci(banci));
        },
        updateInfo: (info: info) => {
            dispatch(updateInfo(info));
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
            openbanci: false,
            openmodal: undefined,
            editing: undefined,
            inputingText: "",
            inputingDate: new Date()
        };
    }

    config: Config = {
        navigationBarTitleText: "班表详情"
    };

    tospeTime(date: Date) {
        date = new Date(date);
        var Month = date.getMonth() + 1;
        var Day = date.getDate();
        var Hour = date.getHours();
        var min = date.getSeconds();
        var M = Month < 10 ? "0" + Month + "." : Month + ".";
        var D = Day + 1 < 10 ? "0" + Day + " " : Day + " ";
        var H = Hour + 1 < 10 ? "0" + Hour + ":" : Hour + ":";
        var Min = min + 1 < 10 ? "0" + min : min;
        return M + D + H + Min;
    }

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

    onShareAppMessage() {
        return {
            title: "班表详情预览",
            path: "/pages/joinSchedule/joinSchedule?_id=" + this.$router.params._id
        };
    }

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

    render() {
        const schedule = this.state.schedule;
        const { infos } = this.state;

        if (schedule === undefined) return <View>发生错误</View>;

        return (
            <View>
                <AtList>
                    <AtListItem title={schedule.title} onClick={() => this.setState({ editing: "title", inputingText: schedule.title })} />
                    <AtListItem title={schedule.description} onClick={() => this.setState({ editing: "description", inputingText: schedule.description })} />
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
                                let count = 0;
                                count++;
                                return (
                                    <View key={item._id}>
                                        <AtListItem
                                            title={this.tospeTime(item.startTime)}
                                            note={"共需要" + item.count.toString() + "人"}
                                            onClick={() => {
                                                this.setState({ openmodal: item._id });
                                            }}
                                        />
                                        {/* 对应listitem生成对应的modal */}
                                        <AtModal isOpened={this.state.openmodal === item._id}>
                                            <AtModalHeader>{"班次" + count} </AtModalHeader>
                                            <AtModalContent>
                                                <View className="at-row">
                                                    <View className="at-col at-col-3">
                                                        <AtIcon prefixClass="icon" value="Customermanagement"></AtIcon>
                                                    </View>
                                                    <View className="at-col at-col-6">
                                                        <Text>成员</Text>
                                                    </View>
                                                </View>
                                                {/* 循环班次成员获取tag */}
                                                <View>
                                                    {infos.length === 0 ? (
                                                        <Text>暂时没有成员</Text>
                                                    ) : (
                                                        <View>
                                                            {infos.map(x => {
                                                                x.classid === item._id;
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
                                                    <View className="at-col at-col-6">{this.tospeTime(item.startTime) + "至" + this.tospeTime(item.endTime)}</View>
                                                </View>
                                                <AtDivider></AtDivider>
                                                <View className="at-row">
                                                    <View className="at-col at-col-3">
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
                </View>
                <View className="btn">
                    <AtButton type="primary" openType="share">
                        分享此班表
                    </AtButton>
                </View>

                <AtModal isOpened={this.state.editing === "title"}>
                    <AtModalHeader>修改班表标题</AtModalHeader>
                    <AtModalContent>
                        <AtInput name="title" value={this.state.inputingText} onChange={v => this.setState({ inputingText: v.toString() })}></AtInput>
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={() => this.setState({ editing: undefined })}>返回</Button>
                        <Button onClick={() => this.updateSche("title", this.state.inputingText)}>更新</Button>
                    </AtModalAction>
                </AtModal>

                <AtModal isOpened={this.state.editing === "description"}>
                    <AtModalHeader>修改班表描述</AtModalHeader>
                    <AtModalContent>
                        <AtInput name="description" value={this.state.inputingText} onChange={v => this.setState({ inputingText: v.toString() })}></AtInput>
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
