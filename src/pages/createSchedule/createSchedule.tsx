import { Picker, Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component, Config } from "@tarojs/taro";
import { AtButton, AtFab, AtForm, AtInput, AtInputNumber, AtIcon } from "taro-ui";
import Banci from "../../classes/banci";
import info from "../../classes/info";
import Schedule from "../../classes/Schedule";
import User from "../../classes/user";
import { updateBanci } from "../../redux/actions/banci";
import { updateInfo } from "../../redux/actions/info";
import { updateSchedule } from "../../redux/actions/schedule";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import { newscheResult } from "../../types";
import getDateFromString from "../../utils/getDateFromString";
import getDateString from "../../utils/getDateString";
import getTimeFromString from "../../utils/getTimeFromString";
import getTimeString from "../../utils/getTimeString";
import "./createSchedule.scss";

/** 定义这个页面的 Props 和 States */
interface Props {
    user: User;
    updateSchedule: (Schedule: Schedule) => void;
    updateBanci: (banci: Banci) => void;
    updateInfo: (info: info) => void;
}

interface State {
    Title: string;
    description: string;
    startact: Date;
    endact: Date;
    bancis: Array<BanciOptions>;
    tag: string;
}

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
    return {
        user: state.user
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

interface BanciOptions {
    repeattype: string;
    repeatStart: Date;
    repeatEnd: Date;
    startTime: Date;
    count: number;
    endTime: Date;
}

class CreateSchedule extends Component<Props, State> {
    config: Config = {
        navigationBarTitleText: "创建新班表"
    };

    constructor(props: Readonly<Props>) {
        super(props);
        const default_startact = new Date();
        const default_endact = new Date();
        default_endact.setDate(new Date().getDate() + 7);
        this.state = {
            tag: "",
            Title: "",
            description: "",
            startact: default_startact,
            endact: default_endact,
            bancis: []
        };
        this.handleBanciChange = this.handleBanciChange.bind(this);
    }

    handleBanciChange(e: any, index: number, key: "RepeatType" | "RepeatStart" | "RepeatEnd" | "StartTime" | "EndTime") {
        var newBancis = this.state.bancis;
        var newDate = new Date();
        if (key === "RepeatStart" || key === "RepeatEnd") newDate = getDateFromString(e.detail.value);
        else if (key === "StartTime" || key === "EndTime") newDate = getTimeFromString(this.state.endact, e.detail.value);

        switch (key) {
            case "RepeatType":
                const repeatTypes = ["不重复", "日循环", "周循环", "月循环"];
                newBancis[index].repeattype = repeatTypes[e.detail.value];
                break;
            case "RepeatStart":
                newBancis[index].repeatStart = newDate;
                break;
            case "RepeatEnd":
                newBancis[index].repeatEnd = newDate;
                break;
            case "StartTime":
                newBancis[index].startTime = newDate;
                break;
            case "EndTime":
                newBancis[index].endTime = newDate;
                break;
        }
        this.setState({ bancis: newBancis });
    }

    createBanci() {
        var newBancis = this.state.bancis;
        const default_endtime = new Date(this.state.startact);
        default_endtime.setHours(default_endtime.getHours() + 1);
        newBancis.push({
            count: 1,
            repeattype: "不重复",
            repeatStart: this.state.startact,
            repeatEnd: this.state.endact,
            startTime: this.state.startact,
            endTime: default_endtime
        });
        this.setState({ bancis: newBancis });
    }

    onSubmit() {
        Taro.showToast({ title: "创建中 ...", icon: "loading", duration: 2000 });
        Taro.cloud.init();
        const title = this.state.Title;
        const description = this.state.description;
        const startact = this.state.startact;
        const endact = this.state.endact;
        const tag = this.state.tag;

        /** 把用户填写的 Bancis 展开为具体的班次数组 */
        var bancis = new Array<{ count: number; startTime: Date; endTime: Date }>();
        this.state.bancis.map(banci => {
            if (banci.repeattype === "不重复") {
                bancis.push({ count: banci.count, startTime: banci.startTime, endTime: banci.endTime });
            } else {
                var datePoniter = new Date(banci.repeatStart);
                while (datePoniter <= banci.repeatEnd) {
                    var start = new Date(datePoniter);
                    var end = new Date(datePoniter);
                    start.setHours(banci.startTime.getHours(), banci.startTime.getMinutes());
                    end.setHours(banci.endTime.getHours(), banci.endTime.getMinutes());
                    bancis.push({ count: banci.count, startTime: start, endTime: end });
                    if (banci.repeattype === "日循环") datePoniter.setDate(datePoniter.getDate() + 1);
                    else if (banci.repeattype === "周循环") datePoniter.setDate(datePoniter.getDate() + 7);
                    else if (banci.repeattype === "月循环") datePoniter.setMonth(datePoniter.getMonth() + 1);
                }
            }
        });

        Taro.cloud
            .callFunction({
                name: "newsche",
                data: {
                    title: title,
                    description: description,
                    startact: startact,
                    endact: endact,
                    tag: tag,
                    bancis: bancis
                }
            })
            .then(res => {
                var resdata = (res as unknown) as newscheResult;
                if (resdata.result.code !== 200) {
                    Taro.showToast({ title: "发生错误", icon: "none", duration: 2000 });
                } else {
                    this.props.updateSchedule(resdata.result.schedule);
                    resdata.result.banci.map(item => {
                        this.props.updateBanci(item);
                    });
                    Taro.navigateTo({
                        url: "../joinSchedule/joinSchedule?_id=" + resdata.result.schedule._id
                    });
                    Taro.showToast({ title: "创建成功", icon: "success", duration: 2000 });
                }
            });
    }

    setBancivalue(value: number, index: number) {
        var newBancis = this.state.bancis;
        newBancis[index].count = value;
        this.setState({
            bancis: newBancis
        });
    }

    onReset() {
        this.setState({
            Title: "",
            description: "",
            startact: new Date(),
            endact: new Date(),
            bancis: []
        });
    }

    removeBanci = (index: number) => {
        var newBancis = [...this.state.bancis];
        newBancis.splice(index, 1);
        this.setState({ bancis: newBancis });
        Taro.showToast({ title: "班次已移除", icon: "success", duration: 1500 });
    };

    render() {
        return (
            <AtForm onSubmit={this.onSubmit.bind(this)} onReset={this.onReset.bind(this)}>
                <View style={{ padding: "24px" }}>
                    <View style={{ marginBottom: "16px" }}>
                        <Text className="form-lable">班表标题</Text>
                        <AtInput
                            name="title"
                            type="text"
                            placeholder="请输入班表标题"
                            value={this.state.Title}
                            onChange={value => this.setState({ Title: value.toString() })}
                        />
                    </View>

                    <View style={{ marginBottom: "16px" }}>
                        <Text className="form-lable">班表描述</Text>
                        <AtInput
                            name="description"
                            type="text"
                            placeholder="请输入班表描述"
                            value={this.state.description}
                            onChange={value => this.setState({ description: value.toString() })}
                        />
                    </View>

                    <View style={{ marginBottom: "16px" }}>
                        <Text className="form-lable">班表开始日期</Text>
                        <View>
                            <Picker
                                value={getDateString(this.state.startact, false)}
                                mode="date"
                                onChange={e => this.setState({ startact: getDateFromString(e.detail.value) })}
                            >
                                <View className="picker form-value">{getDateString(this.state.startact, true)}</View>
                            </Picker>
                        </View>
                    </View>

                    <View style={{ marginBottom: "16px" }}>
                        <Text className="form-lable">班表结束日期</Text>
                        <Picker
                            value={getDateString(this.state.endact, false)}
                            mode="date"
                            onChange={e => this.setState({ endact: getDateFromString(e.detail.value) })}
                        >
                            <View className="picker form-value">{getDateString(this.state.endact, true)}</View>
                        </Picker>
                    </View>

                    {this.state.bancis.map((banci, index) => (
                        <View className="banci-card" key={index + 1}>
                            <Text className="title">班次 #{index + 1}</Text>
                            <View style={{ float: "right" }}>
                                <AtButton type="secondary" size="small" circle={true} onClick={() => this.removeBanci(index)}>
                                    <AtIcon value="trash" color="rgb(121, 168, 170)" />
                                </AtButton>
                            </View>
                            <View className="inner">
                                <View className="option">
                                    <Text className="form-lable">循环模式</Text>
                                    <Picker
                                        value={0}
                                        mode="selector"
                                        range={["不重复", "日循环", "周循环", "月循环"]}
                                        onChange={e => this.handleBanciChange(e, index, "RepeatType")}
                                    >
                                        <View className="picker form-value">{banci.repeattype}</View>
                                    </Picker>
                                </View>

                                {banci.repeattype === "不重复" ? (
                                    <View className="option">
                                        <Text className="form-lable">班次日期</Text>
                                        <Picker
                                            style={{ margin: "12px" }}
                                            value={getDateString(banci.repeatStart, false)}
                                            mode="date"
                                            onChange={e => this.handleBanciChange(e, index, "RepeatStart")}
                                        >
                                            <View className="picker form-value">{getDateString(banci.repeatStart, true)}</View>
                                        </Picker>
                                    </View>
                                ) : (
                                    <View>
                                        <View className="option">
                                            <Text className="form-lable">循环起始日</Text>

                                            <Picker
                                                style={{ margin: "12px" }}
                                                value={getDateString(banci.repeatStart, false)}
                                                mode="date"
                                                onChange={e => this.handleBanciChange(e, index, "RepeatStart")}
                                            >
                                                <View className="picker form-value">{getDateString(banci.repeatStart, true)}</View>
                                            </Picker>
                                        </View>
                                        <View className="option">
                                            <Text className="form-lable">循环终止日</Text>
                                            <Picker
                                                style={{ margin: "12px" }}
                                                value={getDateString(banci.repeatEnd, false)}
                                                mode="date"
                                                onChange={e => this.handleBanciChange(e, index, "RepeatEnd")}
                                            >
                                                <View className="picker form-value">{getDateString(banci.repeatEnd, true)}</View>
                                            </Picker>
                                        </View>
                                    </View>
                                )}

                                <View className="option">
                                    <Text className="form-lable">需要人数</Text>
                                    <View style={{ padding: "18px" }}>
                                        <AtInputNumber
                                            type="number"
                                            value={this.state.bancis[index].count}
                                            onChange={value => {
                                                this.setBancivalue(value, index);
                                            }}
                                            step={1}
                                        />
                                    </View>
                                </View>

                                <View className="option">
                                    <Text className="form-lable">班次开始时间</Text>
                                    <Picker
                                        style={{ margin: "12px" }}
                                        value={getTimeString(banci.startTime, false)}
                                        mode="time"
                                        onChange={e => this.handleBanciChange(e, index, "StartTime")}
                                    >
                                        <View className="picker form-value">{getTimeString(banci.startTime, true)}</View>
                                    </Picker>
                                </View>

                                <View className="option">
                                    <Text className="form-lable">班次结束时间</Text>
                                    <Picker
                                        style={{ margin: "12px" }}
                                        value={getTimeString(banci.endTime, false)}
                                        mode="time"
                                        onChange={e => this.handleBanciChange(e, index, "EndTime")}
                                    >
                                        <View className="picker form-value">{getTimeString(banci.endTime, true)}</View>
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    ))}

                    <View className="post-button">
                        <AtFab onClick={this.createBanci.bind(this)}>
                            <Text className="at-fab__icon at-icon at-icon-add" />
                        </AtFab>
                    </View>

                    <AtButton formType="submit">提交</AtButton>
                    <AtButton formType="reset">重置</AtButton>
                </View>
            </AtForm>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSchedule);
