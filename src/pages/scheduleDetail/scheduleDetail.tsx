import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import { connect } from "@tarojs/redux";

/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
};

type States = {
    schedule: Schedule;
};

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
    return {
        user: state.user,
        schedules: state.schedules
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {};
}
class ScheduleDetail extends Component<Props, States> {
    config: Config = {
        navigationBarTitleText: "班表详情"
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
        }
    }

    render() {
        if (this.state.schedule === undefined) return <View>发生错误</View>;
        else
            return (
                <View className="index">
                    <View>
                        <Text>你正在查看班表 {this.state.schedule.title} 的详情</Text>
                    </View>

                    <Text> 用 this.state.schedule 来取用关于他的完整信息</Text>
                </View>
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDetail);
