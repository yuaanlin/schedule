import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text,Button } from "@tarojs/components";
import store from "../../redux/store";
import { AppState } from "../../redux/types";
import Schedule from "../../classes/schedule";
import User from "../../classes/user";
import Banci from "src/classes/banci";
import info from "src/classes/info";
import { connect,Provider } from "@tarojs/redux";
import { AtBadge,AtButton,AtIcon,AtDivider, AtList,AtListItem,AtAccordion,AtModal, AtModalHeader, AtModalContent, AtModalAction} from "taro-ui";



/** 定义这个页面的 Props 和 States */
type Props = {
    user: User;
    schedules: Array<Schedule>;
    bancis: Array<Banci>;
    infos: Array<info>;
};

type States = {
    schedule: Schedule;
    bancis: Array<Banci>;
    infos: Array<info>;
    openbanci:boolean;
    openmodal:boolean
};

/** 把需要的 State 和 Action 从 Redux 注入 Props */
function mapStateToProps(state: AppState) {
    return {
        user: state.user,
        schedules: state.schedules,
        bancis:state.bancis,
        infos:state.infos,
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
    };
}
class ScheduleDetail extends Component<Props, States> {
    constructor(props){
      super(props);
      this.state = {
        schedule: {
          attenders: []
        },
        bancis: [],
        inofs: []
      }
    }

    config: Config = {
        navigationBarTitleText: "班表详情"
    };
    tospeTime(date: Date){
      date = new Date(Date.parse(date))
      // console.log(typeof(date),date)
      var Month = date.getMonth() + 1;
      var Day = date.getDate();
      var Hour = date.getHours();
      var min = date.getSeconds();
      var M = Month < 10 ? "0" + Month + "." : Month + ".";
      var D = Day + 1 < 10 ? "0" + Day+ " " : Day + " ";
      var H = Hour + 1 < 10 ? "0" + Hour+ ":" : Hour + ":";
      var Min = min + 1 < 10 ? "0" + min: min;
      return  M + D + H + Min;
    }
    toDateString(date: Date) {
      // date = date.toString()
      date = new Date(Date.parse(date))
      // console.log(typeof(date),date)
      var Month = date.getMonth() + 1;
      var Day = date.getDate();
      var Y = date.getFullYear() + ".";
      var M = Month < 10 ? "0" + Month + "." : Month + ".";
      var D = Day + 1 < 10 ? "0" + Day  : Day ;
      return Y + M + D;
  }

    componentDidMount() {
        var scheID = this.$router.params._id;
        // console.log(scheID)
        var sc = this.props.schedules.find(sc => sc._id === scheID);
        // console.log(sc)
        /** 检查当前查看的班表有没有被下载了，没有的话代表用户试图访问和他无关的班表 */
        if (sc === undefined) {
            Taro.showToast({ title: "班表不存在", icon: "none", duration: 2000 });
            Taro.navigateTo({
                url: "../index/index"
            });
        } else {
            this.setState({ schedule: sc });
            let infor;
            // console.log(this.props)
            let ban = this.props.bancis.filter(banci=>{
                infor = this.props.infos.filter(info=>{
                // console.log(info, banci,info.classid === banci._id)
                return info.classid === banci._id
              })
              return banci.scheid===sc._id
              // return banci
            });
            this.setState({ bancis:ban })
            this.setState({ infos:infor })
            // console.log(infor)
            // console.log(this.props.bancis)
        }
        this.setState({openbanci: true });
    }
    componentDidShow() {
    }

    render() {
        const {infos}=this.state
        if (this.state.schedule === undefined) return <View>发生错误</View>;
        else{

        }
            return (
              <View>
                <AtList>
                  <AtListItem title={this.state.schedule.title} note= {this.toDateString(this.state.schedule.startact) + "到" + this.toDateString(this.state.schedule.endact)} />
                  <AtAccordion
                    open={this.state.openbanci}
                    onClick={value => this.setState({ openbanci: value })}
                    title='班次列表'
                  >
                    {/* 循环班次数据库取得所有班次信息 */}
                    {/* {console.log("render-0:",this.state.bancis)} */}
                    {
                    this.state.bancis
                      .map(item=>{
                        // console.log("item-:",item)
                        let count = 0
                        count++;
                        return(
                          <View key={item._id}>
                            <AtListItem
                              title={this.tospeTime(item.startTime)}
                              note={"共需要"+item.count.toString()+"人"}
                              // extraText={item.}
                              onClick={() => {this.setState({openmodal:true})}}
                            />
                            {/* 对应listitem生成对应的modal */}
                            <AtModal  isOpened={this.state.openmodal}>
                              <AtModalHeader>{"班次"+count} </AtModalHeader>
                              <AtModalContent>
                                <View className ="at-row">
                                  <View className="at-col at-col-3"><AtIcon prefixClass='icon' value='Customermanagement'></AtIcon></View>
                                  <View className="at-col at-col-6"><Text>成员</Text></View>
                                </View>
                                {/* 循环班次成员获取tag */}
                                <View>
                                  {console.log(infos)}
                                  {infos ==null
                                    ?<Text>暂时没有成员</Text>
                                    :
                                    <View>{infos
                                      // .filter(x=> x.classid===item._id)
                                      .map(x=>{
                                        x.classid===item._id
                                        return(
                                          <AtBadge key={item._id} >
                                            <AtButton size='small'>{x.tag}</AtButton>
                                          </AtBadge>
                                        )
                                      })
                                    }
                                    </View>
                                  }
                                </View>
                                <AtDivider></AtDivider>
                                <View className="at-row">
                                  <View className="at-col at-col-3"><AtIcon prefixClass='icon' value='clock'></AtIcon></View>
                                  <View className="at-col at-col-6">{this.tospeTime(item.startTime)+"至"+this.tospeTime(item.endTime)}</View>
                                </View>
                                <AtDivider></AtDivider>
                                <View className="at-row">
                                <View className="at-col at-col-3"><AtIcon prefixClass='icon' value='suggest'></AtIcon></View>
                                <View className="at-col at-col-6">{<Text>注意事项之类的</Text>}</View>
                                </View>
                              </AtModalContent>
                              <AtModalAction>
                                <Button onClick={()=>{this.setState({openmodal:false})}}>返回</Button>
                              </AtModalAction>
                            </AtModal>
                          </View>
                        )
                      })
                    }
                  </AtAccordion>
                </AtList>
              </View>
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
