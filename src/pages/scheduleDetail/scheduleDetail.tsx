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
    AtFloatLayout
} from "taro-ui";
import Banci from "../../classes/banci";
import info from "../../classes/info";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import newinfo from "../../classes/newinfo";
import { updateBanci } from "../../redux/actions/banci";
import { updateInfo } from "../../redux/actions/info";
import { updateSchedule } from "../../redux/actions/schedule";
import { updatenewInfo, deletenewInfo } from "../../redux/actions/newinfo";
import { setUserData } from "../../redux/actions/user";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import { updatescheResult, updateTagResult, updateTipsResult, loginResult, getScheResult, pushAttenderResult } from "../../types";
import getDateFromString from "../../utils/getDateFromString";
import getDateString from "../../utils/getDateString";
import getTimeString from "../../utils/getTimeString";

import getAttendersNumber from "../../utils/getAttendersNumber";
import NewUserBadge from "../../components/NewUserBadge";

/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
    bancis: Array<Banci>;
    infos: Array<info>;
    newinfos: Array<newinfo>;
    setUserData: (user: User) => void;
    updateSchedule: (Schedule: Schedule) => void;
    updateBanci: (banci: Banci) => void;
    updateInfo: (info: info) => void;
    updatenewInfo: (newinfo: newinfo) => void;
    deletenewInfo: (id: string) => void;
};

type States = {
    schedule: Schedule;
    bancis: Array<Banci>;
    infos: Array<info>;
    newinfo: Array<newinfo>;

    //添加成员
    addattender: string;
    attenderlist: Array<string>;

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
    tips: string;

    // 班表当前人数
    need_attenders_number: number;
    joined_attenders_number: number;

    // author ?
    author: boolean;
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
        setUserData: (user: User) => {
            dispatch(setUserData(user));
        },
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
        },
        deletenewInfo: (id: string) => {
            dispatch(deletenewInfo(id));
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
            newinfo: new Array<newinfo>(),
            openbanci: false,
            openmodal: undefined,
            editing: undefined,
            inputingText: "",
            inputingDate: new Date(),
            openattenders: true,
            openinfo: "",
            tag: "",
            tips: "",
            addattender: "",
            attenderlist: [],
            need_attenders_number: 0,
            joined_attenders_number: 0,
            author: false
        };
    }

    config: Config = {
        navigationBarTitleText: "班表详情"
    };

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

    /** 计算班表人数数据 */
    updateAttendersNumber = () => {
        var nums = getAttendersNumber(this.$router.params._id);
        this.setState({ need_attenders_number: nums.need_num, joined_attenders_number: nums.joined_num });
    };

    componentDidMount() {
        /** 通过分享链接进来的人要先登入 */
        if (this.props.user._id === "") {
            Taro.cloud
                .callFunction({
                    name: "login"
                })
                .then(res => {
                    var resdata = (res as unknown) as loginResult;
                    if (resdata.result.code === 200) {
                        this.props.setUserData(resdata.result.user);
                    } else {
                        // 第一次进来，请先去 Index 做用户数据入库
                        Taro.redirectTo({
                            url: "../index/index"
                        });
                    }
                });
        }

        var scheID = this.$router.params._id;
        var sc = this.props.schedules.find(sc => sc._id === scheID);

        Taro.cloud
            .callFunction({
                name: "getschedule",
                data: {
                    scheid: scheID
                }
            })
            .then(res => {
                var resdata = (res as unknown) as getScheResult;
                if (resdata.result.code === 200) {
                    this.props.updateSchedule(resdata.result.schedule);
                    resdata.result.newinfo.map(newinfo => {
                        this.props.updatenewInfo(newinfo);
                    });
                    resdata.result.banci.map(banci => {
                        this.props.updateBanci(banci);
                    });
                } else {
                    Taro.showToast({ title: "发生错误", icon: "none", duration: 2000 });
                    Taro.redirectTo({
                        url: "../index/index"
                    });
                }
            });

        if (sc) {
            this.setState({ schedule: sc });
            let newinfo = this.props.newinfos.filter(newinfo => newinfo.scheid === scheID);
            this.setState({ newinfo: newinfo });
            let ban = this.props.bancis.filter(banci => banci.scheid === scheID);
            this.setState({ bancis: ban });
            if (sc.ownerID === this.props.user._id) this.setState({ author: true });
        } else {
            Taro.redirectTo({ url: "../index/index" });
            Taro.showToast({ title: "班表不存在", icon: "none", duration: 2000 });
        }
        this.setState({ openbanci: true });
    }

    onShareAppMessage() {
        return {
            title: "快来看看班表 " + this.state.schedule.title + " 的最新排班结果吧～ ",
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

    updateTag = (newinfo: newinfo, value: string) => {
        var scheID = this.$router.params._id;
        Taro.showToast({ title: "更新中...", icon: "loading", duration: 2000 });
        Taro.cloud
            .callFunction({
                name: "updateTag",
                data: {
                    userid: newinfo.userid,
                    newtag: value,
                    scheid: scheID
                }
            })
            .then(res => {
                var resdata = (res as unknown) as updateTagResult;
                if (resdata.result.code === 200) {
                    resdata.result.data.info.map(x => this.props.updateInfo(x));
                    Taro.showToast({ title: "修改成功", icon: "success", duration: 2000 });
                } else {
                    Taro.showToast({ title: "发生错误", icon: "none", duration: 2000 });
                }
            });
    };

    updateTips = (banci: Banci, tips: string) => {
        Taro.showToast({ title: "更新中...", icon: "loading", duration: 2000 });

        var newBanciTips: string[];
        if (banci.tips) newBanciTips = [...banci.tips];
        else newBanciTips = [];

        newBanciTips.push(tips);

        Taro.cloud
            .callFunction({
                name: "updateTips",
                data: {
                    _id: banci._id,
                    tips: newBanciTips
                }
            })
            .then(res => {
                var resdata = (res as unknown) as updateTipsResult;
                if (resdata.result.code === 200) {
                    this.props.updateBanci(resdata.result.newban);
                    Taro.showToast({ title: "修改成功", icon: "success", duration: 2000 });
                    this.setState({ tips: "" });
                } else {
                    Taro.showToast({ title: "发生错误", icon: "none", duration: 2000 });
                }
            });
    };

    addattender(value: string[]) {
        this.setState({
            attenderlist: value
        });
    }

    pushattender(classid: string, attenderlist: string[]) {
        const sc = this.$router.params;
        const scheID = sc._id;
        let owner = false;
        var curSche = this.props.schedules.find(x => x._id === scheID);
        if (curSche)
            if (curSche.ownerID === this.props.user._id) {
                owner = true;
            } else Taro.showToast({ title: "班表丢失，发生错误", icon: "none", duration: 2000 });
        if (owner) {
            if (attenderlist === undefined || attenderlist.length === 0) {
                Taro.showToast({ title: "没有选择成员", icon: "none", duration: 2000 });
                return;
            }

            this.setState({ addattender: "" });
            let exist = false;
            Taro.showToast({ title: "添加中", icon: "loading", duration: 5000 });
            attenderlist.map((item: string) => {
                this.props.infos.map(x => {
                    if (x.classid === classid && item === x.userid) {
                        exist = true;
                    }
                });
            });
            if (exist) {
                Taro.showToast({ title: "添加失败，有人已存在于目标班次", icon: "none", duration: 2000 });
            } else {
                Taro.cloud
                    .callFunction({
                        name: "addattender",
                        data: {
                            classid: classid,
                            attenderlist: attenderlist,
                            scheid: scheID
                        }
                    })
                    .then(res => {
                        var resdata = (res as unknown) as pushAttenderResult;
                        if (resdata.result.code === 200) {
                            resdata.result.addlist.map(newinfo => {
                                this.props.updateInfo(newinfo);
                            });
                            this.updateAttendersNumber();
                            Taro.showToast({ title: "添加成功", icon: "success", duration: 2000 });
                        } else {
                            Taro.showToast({ title: "发生错误", icon: "none", duration: 2000 });
                        }
                    });
            }
        } else if (curSche) {
            Taro.showToast({ title: "宁无权进行该操作噢", icon: "none", duration: 2000 });
        }
    }

    render() {
        const scheID = this.$router.params._id;
        var { schedule } = this.state;
        let ban = this.state.bancis;
        let newinfos = this.props.newinfos.filter(x => x.scheid === scheID);
        let showinfo: newinfo[] = [];
        newinfos.map(x => {
            let exist: newinfo | undefined = undefined;
            let selfdata = newinfos.find(x => x.userid === this.props.user._id);

            if (showinfo === undefined) {
                selfdata ? (showinfo = [selfdata]) : (showinfo = [x]);
            } else {
                exist = showinfo.find(y => y.userid === x.userid);
                if (!exist) {
                    showinfo.push(x);
                }
            }
        });
        if (!showinfo) showinfo = [];
        var showattender;

        if (showinfo) {
            showinfo.map(x => {
                let item = { value: x._id, label: x.tag };
                if (showattender) showattender = [...showattender, item];
                else showattender = [item];
            });
        }
        if (schedule !== undefined)
            return (
                <View>
                    <AtList>
                        <AtListItem
                            title={schedule.title}
                            onClick={() => this.setState({ editing: "title", inputingText: schedule.title })}
                        />
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
                            <AtAccordion
                                open={this.state.openbanci}
                                onClick={value => this.setState({ openbanci: value })}
                                title="班次列表"
                            >
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
                                            <AtFloatLayout isOpened={this.state.openmodal === item._id}>
                                                <AtModalHeader>
                                                    {getDateString(item.startTime, true) +
                                                        "" +
                                                        getTimeString(item.startTime, true) +
                                                        " 的班次"}
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
                                                    <View className="at-row">
                                                        <View className="at-col at-col-9">
                                                            {newinfos.filter(info => info.classid === item._id).length === 0 ? (
                                                                <Text>没有成员</Text>
                                                            ) : (
                                                                <NewUserBadge
                                                                    user={this.props.user}
                                                                    newinfos={newinfos}
                                                                    banciID={item._id}
                                                                    schedule={schedule}
                                                                    deleteInfo={this.props.deletenewInfo}
                                                                    updateAttendersNumber={this.updateAttendersNumber}
                                                                />
                                                            )}
                                                        </View>
                                                        {this.state.author ? (
                                                            <View className="at-col at-col-3">
                                                                <AtBadge>
                                                                    <AtButton
                                                                        size="small"
                                                                        onClick={() =>
                                                                            this.setState({ addattender: item._id, openmodal: "" })
                                                                        }
                                                                    >
                                                                        添加
                                                                    </AtButton>
                                                                </AtBadge>
                                                            </View>
                                                        ) : (
                                                            <View />
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
                                                        <View className="at-col at-col-1">
                                                            <AtIcon prefixClass="icon" value="suggest"></AtIcon>
                                                        </View>
                                                        <View className="at-col at-col-8">
                                                            <AtInput
                                                                name="tips"
                                                                maxLength={10}
                                                                placeholder="班次共享备注"
                                                                value={this.state.tips}
                                                                onChange={v => {
                                                                    this.setState({ tips: v.toString() });
                                                                }}
                                                            ></AtInput>
                                                            <AtList>
                                                                {item.tips ? (
                                                                    item.tips.map((x, index) => {
                                                                        return <AtListItem key={"tips" + index} title={x} />;
                                                                    })
                                                                ) : (
                                                                    <View />
                                                                )}
                                                            </AtList>
                                                        </View>
                                                        <View className="at-col at-col-3">
                                                            <AtBadge>
                                                                <AtButton
                                                                    size="small"
                                                                    onClick={() => this.updateTips(item, this.state.tips)}
                                                                >
                                                                    添加
                                                                </AtButton>
                                                            </AtBadge>
                                                        </View>
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
                                            </AtFloatLayout>
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
                                {showinfo.map(item => {
                                    return (
                                        <View key={item._id}>
                                            <AtListItem
                                                title={item.tag}
                                                onClick={() => {
                                                    this.setState({ openinfo: item._id });
                                                }}
                                            />
                                            {/* 对应listitem生成对应的modal */}
                                            <AtFloatLayout isOpened={this.state.openinfo === item._id}>
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
                                                                    let e1: {} | null;
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
                                                                    return <View key={item.classid}>{e1}</View>;
                                                                })}
                                                            </View>
                                                        )}
                                                    </View>
                                                </AtModalContent>
                                                <AtModalAction>
                                                    <Button onClick={() => this.setState({ openinfo: "" })}>关闭</Button>
                                                </AtModalAction>
                                            </AtFloatLayout>
                                        </View>
                                    );
                                })}
                            </AtAccordion>
                        </AtList>
                    </View>

                    <AtFloatLayout isOpened={this.state.editing === "title"}>
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
                    </AtFloatLayout>

                    <AtFloatLayout isOpened={this.state.editing === "description"}>
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
                    </AtFloatLayout>

                    <AtFloatLayout isOpened={this.state.editing === "startact"}>
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
                    </AtFloatLayout>

                    <AtFloatLayout isOpened={this.state.editing === "endact"}>
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
                    </AtFloatLayout>
                </View>
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDetail);
