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
class ScheduleDetail extends Component<Props> {
    schedule: Schedule | undefined;
    config: Config = {
        navigationBarTitleText: "班表详情"
    };

    componentDidMount() {
        var scheID = this.$router.params.id;
        this.schedule = this.props.schedules.find(sc => sc._id === scheID);

        /** 检查当前查看的班表有没有被下载了，没有的话代表用户试图访问和他无关的班表 */
        if (this.schedule === undefined) {
            Taro.showToast({ title: "班表不存在", icon: "none", duration: 2000 });
            Taro.navigateTo({
                url: "../index/index"
            });
        }
    }

    render() {
        return (
            <View className="index">
                <View>
                    <Text>这里是班表详情页面</Text>
                    <Text>进来的时候链接应该带有一个 schedule ID</Text>
                    <Text>所以先去后端把这场 schedule 的数据抓回来存到 store 的 scheduleData</Text>
                    <Text>然后用户进到这里的时候 store 的 userData 应该有东西了</Text>
                    <Text>没有的话一样先帮他登入</Text>
                    <Text>如果这个 schedule 不在这个人拥有的或是这个人参加的</Text>
                    <Text>就把它导回首页</Text>
                    <Text>成功进来的话就显示班表内容</Text>
                </View>
                <View>
                    <Text>用户从这个页面可以做这些事情</Text>
                    <Text>1. 查看班表状态</Text>
                </View>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDetail);
