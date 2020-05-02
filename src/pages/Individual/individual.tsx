import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import User from "../../classes/user";
import { connect } from "@tarojs/redux";
import { setUserData } from "../../redux/actions/user";
import { AtTabBar } from "taro-ui";

type Props = {
    user: User;
    setUserData: (user: User) => void;
};

type States = {
    tabcurrent: number;
};

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
        setUserData: (user: User) => {
            dispatch(setUserData(user));
        }
    };
}

class Individual extends Component<Props, States> {
    handlebarClick(value: number) {
        this.setState({
            tabcurrent: value
        });
        if (value == 0) {
            Taro.redirectTo({
                url: "../index/index"
            });
        }
    }
    constructor() {
        super(...arguments);
        this.state = {
            tabcurrent: 1
        };
    }
    render() {
        return (
            <View className="index">
                <Text>个人页面</Text>
                <AtTabBar
                    fixed
                    tabList={[
                        { iconPrefixClass: "icon", iconType: "category", title: "" },
                        { iconPrefixClass: "icon", iconType: "bussiness-man", title: "" }
                    ]}
                    onClick={this.handlebarClick.bind(this)}
                    current={this.state.tabcurrent}
                ></AtTabBar>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Individual);
