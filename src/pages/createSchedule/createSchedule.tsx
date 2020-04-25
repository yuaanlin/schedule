import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton, AtFab } from "taro-ui";

import "./createSchedule.scss";

interface State {
    Title: string;
    description: string;
    startact: Date;
    endact: Date;
    bancis: Array<BanciOptions>;
}

interface BanciOptions {
    repeattype: string;
    repeatStart: Date;
    repeatEnd: Date;
    startTime: Date;
    endTime: Date;
}

class CreateSchedule extends Component<Readonly<{}>, State> {
    config: Config = {
        navigationBarTitleText: "首页"
    };

    constructor() {
        super();
        this.state = {
            Title: "",
            description: "",
            startact: new Date(),
            endact: new Date(),
            bancis: []
        };
        this.handleBanciChange = this.handleBanciChange.bind(this);
    }

    handleTitleChange(v: string) {
        this.setState({ Title: v });
    }

    handleDescriptionChange(v: string) {
        this.setState({ description: v });
    }

    handleStartactChange(e: any) {
        const year = +e.detail.value.split("-")[0];
        const month = +e.detail.value.split("-")[1];
        const date = +e.detail.value.split("-")[2];
        var newDate = new Date();
        newDate.setTime(this.state.startact.getTime());
        newDate.setFullYear(year);
        newDate.setMonth(month - 1);
        newDate.setDate(date);
        this.setState({ startact: newDate });
    }

    handleEndactChange(e: any) {
        const year = +e.detail.value.split("-")[0];
        const month = +e.detail.value.split("-")[1];
        const date = +e.detail.value.split("-")[2];
        var newDate = new Date();
        newDate.setTime(this.state.endact.getTime());
        newDate.setFullYear(year);
        newDate.setMonth(month - 1);
        newDate.setDate(date);
        this.setState({ endact: newDate });
    }

    handleBanciChange(e: any, index: number, key: "RepeatType" | "RepeatStart" | "RepeatEnd" | "StartTime" | "EndTime") {
        var newBancis = this.state.bancis;
        var newDate = new Date();
        if (key === "RepeatStart" || key === "RepeatEnd" || key === "StartTime" || key === "EndTime") {
            const year = +e.detail.value.split("-")[0];
            const month = +e.detail.value.split("-")[1];
            const date = +e.detail.value.split("-")[2];
            var newDate = new Date();
            newDate.setTime(this.state.endact.getTime());
            newDate.setFullYear(year);
            newDate.setMonth(month - 1);
            newDate.setDate(date);
        }
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
        newBancis.push({
            repeattype: "不重复",
            repeatStart: new Date(),
            repeatEnd: new Date(),
            startTime: new Date(),
            endTime: new Date()
        });
        this.setState({ bancis: newBancis });
    }

    onSubmit() {
        Taro.cloud.init();
        const title = this.state.Title;
        const description = this.state.description;
        const startact = this.state.startact;
        const endact = this.state.endact;

        Taro.cloud
            .callFunction({
                name: "newsche",
                data: {
                    title: title,
                    description: description,
                    startact: startact,
                    endact: endact
                }
            })
            .then(res => {
                console.log(res);
            });
    }

    onReset() {
        this.setState({
            Title: "",
            description: "",
            startact: new Date(),
            endact: new Date()
        });
    }

    render() {
        return (
            <AtForm onSubmit={this.onSubmit.bind(this)} onReset={this.onReset.bind(this)}>
                <AtInput
                    name="title"
                    title="活动标题"
                    type="text"
                    placeholder="请输入活动标题"
                    value={this.state.Title}
                    onChange={this.handleTitleChange.bind(this)}
                />
                <AtInput
                    name="description"
                    title="活动描述"
                    type="text"
                    placeholder="请输入活动描述"
                    value={this.state.description}
                    onChange={this.handleDescriptionChange.bind(this)}
                />
                <Text>活动时间开始</Text>
                <View>
                    <Picker mode="date" onChange={this.handleStartactChange.bind(this)}>
                        <View className="picker">{this.state.startact.toISOString()}</View>
                    </Picker>
                </View>
                <Text>活动时间结束</Text>
                <View>
                    <Picker mode="date" onChange={this.handleEndactChange.bind(this)}>
                        <View className="picker">{this.state.endact.toISOString()}</View>
                    </Picker>
                </View>

                {this.state.bancis.map((banci, index) => (
                    <View style={{ backgroundColor: "rgb(240,240,240)", margin: "18px", padding: "18px" }}>
                        <Picker
                            mode="selector"
                            range={["不重复", "日循环", "周循环", "月循环"]}
                            onChange={e => this.handleBanciChange(e, index, "RepeatType")}
                        >
                            <View className="picker">{banci.repeattype}</View>
                        </Picker>
                        <Text>班次重複起點</Text>
                        <View>
                            <Picker mode="date" onChange={e => this.handleBanciChange(e, index, "RepeatStart")}>
                                <View className="picker">{banci.repeatStart.toISOString()}</View>
                            </Picker>
                        </View>
                        <Text>班次重複終點</Text>
                        <View>
                            <Picker mode="date" onChange={e => this.handleBanciChange(e, index, "RepeatEnd")}>
                                <View className="picker">{banci.repeatEnd.toISOString()}</View>
                            </Picker>
                        </View>
                        <Text>班次開始時間</Text>
                        <View>
                            <Picker mode="date" onChange={e => this.handleBanciChange(e, index, "StartTime")}>
                                <View className="picker">{banci.startTime.toISOString()}</View>
                            </Picker>
                        </View>
                        <Text>班次結束時間</Text>
                        <View>
                            <Picker mode="date" onChange={e => this.handleBanciChange(e, index, "EndTime")}>
                                <View className="picker">{banci.endTime.toISOString()}</View>
                            </Picker>
                        </View>
                    </View>
                ))}

                <View className="post-button">
                    <AtFab onClick={this.createBanci.bind(this)}>
                        <Text className="at-fab__icon at-icon at-icon-add"></Text>
                    </AtFab>
                </View>

                <AtButton formType="submit">提交</AtButton>
                <AtButton formType="reset">重置</AtButton>
            </AtForm>
        );
    }
}

export default CreateSchedule as ComponentClass;
