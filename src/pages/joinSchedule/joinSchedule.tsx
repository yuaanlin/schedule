import { Button, Picker, Text, View, Block } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component, Config } from "@tarojs/taro";
import {
    AtAccordion,
    AtButton,
    AtBadge,
    AtDivider,
    AtIcon,
    AtInput,
    AtList,
    AtListItem,
    AtModal,
    AtModalAction,
    AtModalContent,
    AtModalHeader,
    AtToast
} from "taro-ui";
import Banci from "../../classes/banci";
import info from "../../classes/info";
import newinfo from "../../classes/newinfo";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import UserBadge from "../../components/UserBadge";
import { updateBanci } from "../../redux/actions/banci";
import { deleteInfo, updateInfo } from "../../redux/actions/info";
import { updateSchedule } from "../../redux/actions/schedule";
import { setUserData } from "../../redux/actions/user";
import { updatenewInfo } from "../../redux/actions/newinfo";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import { getPerscheResult, loginResult, updatescheResult, arrangescheResult, publicscheResult, updateTagResult } from "../../types";
import checkIfInvolved from "../../utils/checkIfInvolved";
import getDateFromString from "../../utils/getDateFromString";
import getDateString from "../../utils/getDateString";
import getTimeString from "../../utils/getTimeString";
import "./joinSchedule.scss";

/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
    bancis: Array<Banci>;
    infos: Array<info>;
    newinfos: Array<newinfo>;
    setUserData: (user: User) => void;
    updateInfo: (info: info) => void;
    deleteInfo: (id: string) => void;
    updateBanci: (banci: Banci) => void;
    updateSchedule: (Schedule: Schedule) => void;
    updatenewInfo: (newinfo: newinfo) => void;
};

type States = {
    openbanci: boolean;
    gettag: boolean;
    warntag: boolean;
    tag: string;
    author: boolean;

    // 正在编辑的项目
    editing: string | undefined;

    // 当前查看的班次 ID
    openmodal: string;

    // 输入内容暂存区
    inputingText: string;
    inputingDate: Date;
    showresult: boolean;

    //成功info信息
    newinfo: Array<info>;
    //失败信息
    failman: Array<User>;
    failclass: Array<Banci>;
    failinfo: Array<info>;

    openattenders: boolean;

    openinfo: string;
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
        updateInfo: (info: info) => {
            dispatch(updateInfo(info));
        },
        deleteInfo: (id: string) => {
            dispatch(deleteInfo(id));
        },
        updateBanci: (banci: Banci) => {
            dispatch(updateBanci(banci));
        },
        updatenewInfo: (newinfo: newinfo) => {
            dispatch(updatenewInfo(newinfo));
        }
    };
}

class JoinSchedule extends Component<Props, States> {
    constructor(props: Readonly<Props> | undefined) {
        super(props);
        this.state = {
            inputingText: "",
            inputingDate: new Date(),
            editing: undefined,
            openbanci: true,
            openmodal: "",
            gettag: false,
            warntag: false,
            tag: "",
            author: false,
            showresult: false,
            failman: [],
            failclass: [],
            newinfo: [],
            failinfo: [],
            openattenders: true,
            openinfo: ""
        };
    }

    config: Config = {
        navigationBarTitleText: "加入班表"
    };

    getInvolved(classid: string) {
        var scheID = this.$router.params._id;
        if (checkIfInvolved(this.props.user._id, classid)) {
            Taro.showToast({ title: "你已经报名这个班次啦！", icon: "none", duration: 2000 });
            return;
        }
        if (!this.state.tag) {
            this.setState({
                gettag: true
            });
            return;
        }
        Taro.showToast({ title: "报名中", icon: "loading", duration: 2000 });
        Taro.cloud
            .callFunction({
                name: "newinfo",
                data: {
                    classid: classid,
                    tag: this.state.tag,
                    scheid: scheID
                }
            })
            .then(() =>
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
                            Taro.showToast({ title: "报名成功", icon: "success", duration: 2000 });
                        } else {
                            Taro.showToast({ title: "班表不存在", icon: "none", duration: 2000 });
                            Taro.redirectTo({
                                url: "../index/index"
                            });
                        }
                    })
            );
    }

    publicsche() {
        var scheID = this.$router.params._id;
        var schedule = this.props.schedules.find(sc => sc._id === scheID);
        var newinfo = this.state.newinfo;
        Taro.cloud
            .callFunction({
                name: "publicsche",
                data: {
                    schedule: schedule,
                    newinfo: newinfo
                }
            })
            .then(res => {
                var resdata = (res as unknown) as publicscheResult;
                if (resdata.result.code === 200) {
                    resdata.result.newinfo.map(newinfo => {
                        this.props.updatenewInfo(newinfo);
                    });
                }
            });
        Taro.showToast({ title: "发布成功", icon: "success", duration: 2000 });
        Taro.redirectTo({
            url: "/pages/scheduleDetail/scheduleDetail?_id=" + this.$router.params._id
        });
    }

    getTag() {
        if (this.state.tag != null) {
            this.setState({ gettag: false });
        } else {
            this.setState({ warntag: true });
        }
    }

    componentDidMount() {
        Taro.cloud.init();

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

        /** 前端找不到班表，先下载请求的班表数据 */
        if (sc === undefined) {
            Taro.cloud
                .callFunction({
                    name: "scheid"
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
                    } else {
                        Taro.showToast({ title: "班表不存在", icon: "none", duration: 2000 });
                        Taro.redirectTo({
                            url: "../index/index"
                        });
                    }
                });
        }

        /** 如果这个用户已经报名过这个班表，自动载入 tag */
        var exsistTag: string | undefined = undefined;
        this.props.infos.map(i => {
            if (!exsistTag && i.scheid === scheID && i.userid === this.props.user._id) {
                exsistTag = i.tag;
            }
        });
        if (exsistTag !== undefined) this.setState({ tag: exsistTag });

        /** 检查用户是不是班表拥有者 */
        if (sc !== undefined && sc.ownerID === this.props.user._id) {
            this.setState({ author: true });
        } else {
            this.setState({ author: false });
        }
    }

    onShareAppMessage() {
        return {
            title: "班表详情预览",
            path: "/pages/joinSchedule/joinSchedule?_id=" + this.$router.params._id
        };
    }

    arrangeSche = () => {
        var scheID = this.$router.params._id;
        var sc = this.props.schedules.find(sc => sc._id === scheID);
        if (this.state.author === false) {
            Taro.showToast({ title: "宁没有此权限", icon: "none", duration: 2000 });
        } else {
            var sc = this.props.schedules.find(sc => sc._id === scheID);
            let ban = this.props.bancis.filter(banci => banci.scheid === scheID);
            let infor = this.props.infos.filter(info => {
                var bid = info.classid;
                var found = false;
                ban.map(b => {
                    if (b._id === bid) found = true;
                });
                return found;
            });

            const schedule = sc;
            const infos = infor;
            const bancis = ban;
            Taro.cloud
                .callFunction({
                    name: "arrangesche",
                    data: {
                        bancis: bancis,
                        infos: infos,
                        schedule: schedule
                    }
                })
                .then(res => {
                    var resdata = (res as unknown) as arrangescheResult;
                    if (resdata.result.code === 200) {
                        this.setState({
                            showresult: true,
                            newinfo: resdata.result.infos,
                            failinfo: resdata.result.failinfo,
                            failman: resdata.result.leftman,
                            failclass: resdata.result.leftban
                        });
                    }
                });
        }
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
    updateSche = (schedule: Schedule, key: string, value: string | Date) => {
        var newScheData = {};
        if (key === "title") {
            newScheData = {
                ...schedule,
                title: value
            };
        } else if (key === "description") {
            newScheData = {
                ...schedule,
                description: value
            };
        } else if (key === "startact") {
            newScheData = {
                ...schedule,
                startact: value
            };
        } else if (key === "endact") {
            newScheData = {
                ...schedule,
                endact: value
            };
        }

        Taro.showToast({ title: "更新中...", icon: "loading", duration: 2000 });
        Taro.cloud.callFunction({ name: "updatesche", data: newScheData }).then(res => {
            var resdata = (res as unknown) as updatescheResult;
            if (resdata.result.code === 200) {
                this.props.updateSchedule(resdata.result.schedule);
                this.setState({ editing: undefined });
            } else {
                Taro.showToast({ title: "发生错误", icon: "none", duration: 2000 });
            }
        });
    };

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
        var scheID = this.$router.params._id;
        var sc = this.props.schedules.find(sc => sc._id === scheID);
        let ban = this.props.bancis.filter(banci => banci.scheid === scheID);
        let infor = this.props.infos.filter(info => {
            var bid = info.classid;
            var found = false;
            ban.map(b => {
                if (b._id === bid) found = true;
            });
            return found;
        });
        let showinfo: info[] = [];
        infor.map(x => {
            let exist: info | undefined = undefined;
            let selfdata = infor.find(x => x.userid === this.props.user._id);

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
        const schedule = sc;
        const infos = infor;
        const bancis = ban;
        const failclass = this.state.failclass;
        const failinfo = this.state.failinfo;
        if (schedule !== undefined)
            return (
                <View>
                    <AtModal isOpened={this.state.showresult}>
                        <AtModalHeader>匹配结果</AtModalHeader>
                        <AtModalContent>
                            <View className="at-row">
                                <View className="at-col at-col-3">
                                    <AtIcon prefixClass="icon" value="Customermanagement"></AtIcon>
                                </View>
                                <View className="at-col at-col-6">
                                    <Text>成员匹配结果</Text>
                                </View>
                            </View>
                            <View>
                                {failinfo.length === 0 ? (
                                    <Text>全部成员匹配成功</Text>
                                ) : (
                                    <View>
                                        以下成员未能成功排入班次：
                                        {failinfo.map(x => {
                                            return (
                                                <AtButton className="btn" key={x._id} size="small">
                                                    {x.tag}
                                                </AtButton>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                            <AtDivider></AtDivider>
                            <View className="at-row">
                                <View className="at-col at-col-3">
                                    <AtIcon prefixClass="icon" value="Customermanagement"></AtIcon>
                                </View>
                                <View className="at-col at-col-6">
                                    <Text>班次匹配结果</Text>
                                </View>
                            </View>
                            <View>
                                {failclass.length === 0 ? (
                                    <Text>全部班次匹配成功</Text>
                                ) : (
                                    <View>
                                        <Text>以下班次未能排入足够的成员：</Text>
                                        {failclass.map(x => (
                                            <AtButton
                                                className="btn"
                                                key={x._id}
                                                onClick={() => {
                                                    this.setState({ openmodal: x._id });
                                                }}
                                            >
                                                {getDateString(x.startTime, true) + "" + getTimeString(x.startTime, true) + "开始的班次"}
                                            </AtButton>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </AtModalContent>
                        <AtModalAction>
                            <Button onClick={() => this.setState({ showresult: false })}>返回</Button>
                            <Button onClick={this.publicsche}>发布班表</Button>
                        </AtModalAction>
                    </AtModal>

                    <AtList>
                        <AtListItem
                            title={schedule.title}
                            onClick={() => {
                                if (this.props.user._id === schedule.ownerID)
                                    this.setState({ editing: "title", inputingText: schedule.title });
                            }}
                        />
                        <AtListItem
                            title={schedule.description}
                            onClick={() => {
                                if (this.props.user._id === schedule.ownerID)
                                    this.setState({ editing: "description", inputingText: schedule.description });
                            }}
                        />
                        <AtListItem
                            title={getDateString(schedule.startact, true)}
                            note="班表开始日期"
                            onClick={() => {
                                if (this.props.user._id === schedule.ownerID)
                                    this.setState({ editing: "startact", inputingDate: schedule.startact });
                            }}
                        />
                        <AtListItem
                            title={getDateString(schedule.endact, true)}
                            note="班表结束日期"
                            onClick={() => {
                                if (this.props.user._id === schedule.ownerID)
                                    this.setState({ editing: "endact", inputingDate: schedule.endact });
                            }}
                        />
                        <AtListItem note="该班表正在报名阶段，您可以从下方选择要报名的班次来参加。" />
                    </AtList>
                    <View style={{ marginTop: "32px" }}>
                        <AtList>
                            <AtAccordion
                                open={this.state.openbanci}
                                onClick={value => this.setState({ openbanci: value })}
                                title="班次列表"
                            >
                                {/* 循环班次数据库取得所有班次信息 */}
                                {bancis.map(item => {
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
                                                    {getDateString(item.startTime, true) +
                                                        "" +
                                                        getTimeString(item.startTime, true) +
                                                        "开始的班次"}{" "}
                                                </AtModalHeader>
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
                                                        {infos.filter(info => info.classid === item._id).length === 0 ? (
                                                            <Text>没有成员</Text>
                                                        ) : (
                                                            <UserBadge
                                                                user={this.props.user}
                                                                infos={infos}
                                                                banciID={item._id}
                                                                schedule={schedule}
                                                                deleteInfo={this.props.deleteInfo}
                                                            />
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
                                                        <View className="at-col at-col-3">
                                                            <AtIcon prefixClass="icon" value="suggest"></AtIcon>
                                                        </View>
                                                        <View className="at-col at-col-6">{<Text>注意事项之类的</Text>}</View>
                                                    </View>
                                                </AtModalContent>
                                                <AtModalAction>
                                                    <Button onClick={() => this.setState({ openmodal: "" })}>关闭</Button>
                                                    <Button onClick={this.getInvolved.bind(this, item._id)}>加入该班次</Button>
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
                                                        {bancis.filter(x => x._id === item.classid).length === 0 ? (
                                                            <Text>没有加入任何班次</Text>
                                                        ) : (
                                                            <View>
                                                                {bancis.map(x => {
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
                                                                    return <Block>{e1}</Block>;
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
                        <View className="btn">
                            <AtButton type="primary" onClick={this.arrangeSche}>
                                生成排班
                            </AtButton>
                            {/* <AtButton type="primary" openType="share">
                                分享此班表
                            </AtButton> */}
                        </View>
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
                            <Button onClick={() => this.updateSche(schedule, "title", this.state.inputingText)}>更新</Button>
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
                            <Button onClick={() => this.updateSche(schedule, "description", this.state.inputingText)}>更新</Button>
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
                            <Button onClick={() => this.updateSche(schedule, "startact", this.state.inputingDate)}>更新</Button>
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
                            <Button onClick={() => this.updateSche(schedule, "endact", this.state.inputingDate)}>更新</Button>
                        </AtModalAction>
                    </AtModal>
                    <AtModal isOpened={this.state.gettag}>
                        <AtModalHeader>请先填写个人信息</AtModalHeader>
                        <AtModalContent>
                            <AtInput
                                required
                                name="tag"
                                type="text"
                                placeholder="输入一个方便辨认的代号"
                                value={this.state.tag}
                                onChange={value => {
                                    this.setState({ tag: value.toString() });
                                }}
                            />
                        </AtModalContent>
                        <AtModalAction>
                            <Button onClick={this.getTag.bind(this)}>确定</Button>
                        </AtModalAction>
                    </AtModal>
                    <AtToast isOpened={this.state.warntag} text="请先填写个人信息" />
                </View>
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinSchedule);
