import { Image, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import logo from "../../assets/image/logo.jpg";
import User from "../../classes/user";
import { setUserData } from "../../redux/actions/user";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import "./aboutus.scss";

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

class Aboutus extends Component<Props, States> {
    onImageClick() {
        Taro.previewImage({
            urls: [this.props.user.avatarUrl]
        });
    }
    render() {
        return (
            <View className="index">
                {/* <View className='at-row'> */}
                <View className="logged-mine">
                    <Image src={logo} className="mine-avatar" onClick={this.onImageClick} />
                    <View className="Introduction">{"这里是来自ZJU的勤小创~"}</View>
                </View>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Aboutus);
