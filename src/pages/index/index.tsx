import { ComponentClass } from "react";
import Taro, { Component, Config, login } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtList, AtListItem, AtFab } from "taro-ui";
import "./index.scss";
import User from "../../classes/user";
import Schedule from "../../classes/schedule";
import store from '../../redux/store'
import { connect } from "@tarojs/redux";
import { setUserData } from "../../redux/actions/user";
import { updateSchedule } from "../../redux/actions/schedule"

/** 定义这个页面的 Props 和 States */
type Props = {
  user: User;
  Schedule: Array<Schedule>;
  setUserData: (user: User) => void;
  updateSchedule: (Schedule:Array<Schedule>) => void
};

type States = {
    current: number;
    schedule: Array<Schedule>
};

/** 把 Store 里面这个页面需要的 States 和 Actions 放入 Props */
@connect(
  ({ user, Schedule,setUserData,updateSchedule }) => ({
      user,
      Schedule,
      setUserData,
      updateSchedule
  }),
  dispatch => ({
      setUserData: (user: User) => dispatch(setUserData(user)),
      updateSchedule:(Schedule:Array<Schedule>) => dispatch(updateSchedule(Schedule))
  })
)

/** 首页 */
class Index extends Component<Props, States> {
    config: Config = {
        navigationBarTitleText: "首页"
    };

    componentDidMount() {
      Taro.cloud.init();
      Taro.cloud
        .callFunction({
            name: "login"
        })
        .then(res => {
            var resdata = (res.result as unknown) as getUserDataResponse;
            console.log(this.props)
            if (res.code === 200) {
              this.props.setUserData(new User(resdata));
            }
            Taro.cloud
                .callFunction({
                  name:"getPersche"
                })
                .then(res=>{
                  var resdata = (res.result as unknown) as getScheduleDataResponse
                  this.props.updateSchedule(new Array<Schedule>(resdata.data.schedule))
                  // console.log(resdata)
                  this.setState({...this.state, schedule: resdata.data.schedule})
                  // console.log(this.state)
                  // console.log(this.props.Schedule)
                  // console.log(this.props.user)
                  // console.log(this.props.updateSchedule)
                })
        });

    }

    getUserInfo(e: any) {
        Taro.cloud.init();
        const { detail } = e;
        // alert(e)
        Taro.cloud
            .callFunction({
                name: "postUserInfo",
                data: {
                    name: detail.userInfo.nickName,
                    avatarUrl: detail.userInfo.avatarUrl,
                    gender: detail.userInfo.gender
                }
            })
            .then(res => {
              // alert(res)
                var resdata = (res.result as unknown) as getUserDataResponse;
                Taro.showToast({ title: "登入成功", icon: "success", duration: 2000 });
                this.props.setUserData(new User(resdata.data));
                // console.log(resdata)
            });
    }



    constructor() {
        super(...arguments);
        this.state = {
            current: 0,
            schedule: []
        };
        store.subscribe(()=>{
          console.log(this.state)
          // this.setState(store.getState())
          // const state = store.getState()
        })
    }

    createsche() {
        Taro.navigateTo({
            url: "../createSchedule/createSchedule"
        });
    }

    handleClick(value: number) {
        this.setState({
            current: value
        });
    }
    getDetail(_id) {
      Taro.cloud.callFunction({
          name: "getschedule",
          data: {
              scheid: {_id}
          }
      });
      Taro.navigateTo({
          url: "../scheduleDetail/scheduleDetail?_id={_id}"
      });
  }
    render() {
        /** 尚未登入 */
        if (this.props.user.id === "") {
            return (
                <View style={{ textAlign: "center", padding: "36px" }}>
                    <Text>请先登入才能使用小程序的完整功能哦！</Text>
                    <Button style={{ marginTop: "60px" }} openType="getUserInfo" onGetUserInfo={this.getUserInfo}>
                        透过微信授权登入
                    </Button>
                </View>
            );
        }

        /** 已经登入 */
        const tabList = [{ title: "我组织的" }, { title: "我参与的" }];
        return (
            <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
                <AtTabsPane current={this.state.current} index={0}>
                    <View style={{ paddingBottom: "80px" }}>
                        <AtList>
                        {this.state.schedule.map((item)=>(
                          // console.log(item)
                         <AtListItem key={item._id} arrow="right" note={item.description} title={item.title} extraText="" onClick={this.getDetail(item._id)} />
                        ))}
                        </AtList>
                        <View className="post-button">
                            <AtFab onClick={this.createsche}>
                                <Text className="at-fab__icon at-icon at-icon-add"></Text>
                            </AtFab>
                        </View>
                    </View>
                </AtTabsPane>

                <AtTabsPane current={this.state.current} index={1}>
                    <View style="padding: 100px 50px;background-color: #FAFBFC;text-align: center;">标签页二的内容</View>
                </AtTabsPane>
            </AtTabs>
        );
    }
}

interface getUserDataResponse {
    code: number;
    errMsg: string;
    requestID: string;
    result: {
        appid: string;
        openid: string;
    };
    data: User;
}

interface getScheduleDataResponse {
  code: number;
  errMsg: string;
  requestID: string;
  result: {
      appid: string;
      openid: string;
  };
  data: Array<Schedule>
}

export default Index as ComponentClass;
