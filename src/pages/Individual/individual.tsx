import { Image, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import { AtList, AtListItem, AtTabBar } from "taro-ui";
import User from "../../classes/user";
import { setUserData } from "../../redux/actions/user";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import "./individual.scss";

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
    onImageClick() {
        Taro.previewImage({
            urls: [this.props.user.avatarUrl]
        });
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
                {/* <View className='at-row'> */}
                <View className="logged-mine">
                    <Image src={this.props.user.avatarUrl} className="mine-avatar" onClick={this.onImageClick} />
                    <View className="mine-nickName">{this.props.user.name ? this.props.user.name : "勤小创"}</View>
                </View>
                <View className="myteam">
                    <AtList>
                        <AtListItem iconInfo={{ prefixClass: "icon", value: "Customermanagement" }} title="我的团队" arrow="right" />
                    </AtList>
                </View>
                <View className="relevant">
                    <AtList>
                        <AtListItem
                            iconInfo={{ prefixClass: "icon", value: "add-account" }}
                            title="关于我们"
                            arrow="right"
                            onClick={() => {
                                Taro.navigateTo({ url: "../aboutus/aboutus" });
                            }}
                        />
                        <AtListItem
                            iconInfo={{ prefixClass: "icon", value: "suggest" }}
                            title="意见反馈"
                            arrow="right"
                            onClick={() => {
                                Taro.navigateTo({ url: "../suggest/suggest" });
                            }}
                        />
                    </AtList>
                </View>
                <AtTabBar
                    fixed
                    tabList={[
                        { iconPrefixClass: "icon", iconType: "category", title: "" },
                        { iconPrefixClass: "icon", iconType: "usercenter", title: "" }
                    ]}
                    onClick={this.handlebarClick.bind(this)}
                    current={this.state.tabcurrent}
                ></AtTabBar>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Individual);
