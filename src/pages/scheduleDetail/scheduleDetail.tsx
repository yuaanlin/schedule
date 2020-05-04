import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text,Button } from "@tarojs/components";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import Banci from "src/classes/banci";
import { connect,Provider } from "@tarojs/redux";
import { AtBadge,AtButton,AtIcon,AtDivider, AtList,AtListItem,AtAccordion,AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui";


/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
    bancis: Array<Banci>;
};

type States = {
    schedule: Schedule;
    openbanci:boolean;
    openmodal:boolean
};

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
    return {
        user: state.user,
        schedules: state.schedules,
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
    };
}
class ScheduleDetail extends Component<Props, States> {
    config: Config = {
        navigationBarTitleText: "班表详情"
    };

    toDateString(date: Date) {
      var Month = date.getMonth() + 1;
      var Day = date.getDate();
      var Y = date.getFullYear() + ".";
      var M = Month < 10 ? "0" + Month + "." : Month + ".";
      var D = Day + 1 < 10 ? "0" + Day  : Day ;
      return Y + M + D;
  }

    componentDidMount() {
        var scheID = this.$router.params._id;
        // console.log(this.props.schedules)
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
        this.setState({openbanci: true });
        console.log(store)
        // var ban;
        // console.log(this.props.bancis)
        // this.state.schedule.bancis.map(value=>{
        //   ban.push(this.props.bancis.filter(x=>x._id===value))
        // })
        // console.log(ban)
    }

    render() {
        if (this.state.schedule === undefined) return <View>发生错误</View>;
        else
            return (
                <AtList>
                  <AtListItem title={this.state.schedule.title} note= {this.toDateString(this.state.schedule.startact)+"到"+this.toDateString(this.state.schedule.endact)} />
                  <AtAccordion
                    open={this.state.openbanci}
                    onClick={value => this.setState({ openbanci: value })}
                    title='班次列表'
                  >
                    {/* 循环班次数据库取得所有班次信息 */}
                    <AtListItem
                      title='班次标题'
                      note='需要人数{banci[i].count}'
                      extraText='是否重复{banci.repeattype}'
                      onClick={() => {this.setState({openmodal:true})}}
                    />
                    {/* 对应listitem生成对应的modal */}
                    <AtModal  isOpened={this.state.openmodal}>
                      <AtModalHeader>班次标题</AtModalHeader>
                      <AtModalContent>
                        <View className ="at-row">
                          <View className="at-col at-col-3"><AtIcon prefixClass='icon' value='Customermanagement'></AtIcon></View>
                          <View className="at-col at-col-6"><Text>成员</Text></View>
                        </View>
                        {/* 循环班次成员获取tag */}
                        <AtBadge >
                            <AtButton size='small'>tag</AtButton>
                        </AtBadge>
                        <AtDivider></AtDivider>
                        <View className="at-row">
                          <View className="at-col at-col-3"><AtIcon prefixClass='icon' value='clock'></AtIcon></View>
                          <View className="at-col at-col-6"><Text>班表详细时间</Text></View>
                        </View>
                        <AtDivider></AtDivider>
                        <View className="at-row">
                        <View className="at-col at-col-3"><AtIcon prefixClass='icon' value='suggest'></AtIcon></View>
                        <View className="at-col at-col-6"><Text>注意事项之类的</Text></View>
                        </View>
                      </AtModalContent>
                      <AtModalAction>
                        <Button onClick={()=>{this.setState({openmodal:false})}}>返回</Button>
                      </AtModalAction>
                    </AtModal>
                  </AtAccordion>
                </AtList>
                // <View className="index">
                //     <View>
                //         <Text>你正在查看班表 {this.state.schedule.title} 的详情</Text>
                //     </View>

                //     <Text> 用 this.state.schedule 来取用关于他的完整信息</Text>
                // </View>
            );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDetail);
