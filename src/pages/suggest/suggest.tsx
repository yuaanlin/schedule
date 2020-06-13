import { Text, View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import Taro, { Component, Config } from "@tarojs/taro";
import { AtButton, AtForm, AtImagePicker, AtInput, AtTextarea } from "taro-ui";
import { File } from "taro-ui/types/image-picker";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import { AppState } from "../../redux/types";
import "./suggest.scss";

/** 定义这个页面的 Props 和 States */
type Props = {
  user: User;
  schedules: Array<Schedule>;
};

type States = {
  schedule: Schedule;
  suggest: string;
  files: Array<File>;
  contact: string;
};

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
  return {
    user: state.user,
    schedules: state.schedules
  };
}

class ScheduleDetail extends Component<Props, States> {
  config: Config = {
    navigationBarTitleText: "意见反馈"
  };

  onSubmit() {
    this.setState({
      suggest: "",
      files: [],
      contact: ""
    })
    Taro.showToast({ title: "提交成功！", icon: "success", duration: 2000 });
  }
  componentDidMount() {}

  render() {
    return (
      <View style={{ margin: "24px" }}>
        <AtForm onSubmit={this.onSubmit.bind(this)}>
          <Text className="form-lable">您的宝贵意见：</Text>
          <AtTextarea
            value={this.state.suggest}
            onChange={value => {
              this.setState({ suggest: value });
            }}
            maxLength={200}
            placeholder="你的问题是..."
          />
          <View className="form-lable">截图上传</View>
          <AtImagePicker
            length={5}
            files={this.state.files}
            onChange={value => {
              this.setState({ files: value });
            }}
          />
          <View className="form-lable">您的联系方式</View>
          <AtInput
            name="title"
            type="text"
            placeholder="请输入联系方式"
            value={this.state.contact}
            onChange={value => {
              this.setState({ contact: value.toString() });
            }}
          />
          <AtButton formType="submit">提交</AtButton>
        </AtForm>
      </View>
    );
  }
}

export default connect(mapStateToProps)(ScheduleDetail);
