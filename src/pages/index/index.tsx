import { ComponentClass } from "react";
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text ,Button} from "@tarojs/components";
import {AtTabs,AtTabsPane,AtList,AtListItem,AtFab} from 'taro-ui'
import './index.scss'
class Index extends Component {
    config: Config = {
        navigationBarTitleText: "首页"
    };
    login () {
      Taro.cloud.init()
      console.log("!")
      Taro.cloud
          .callFunction({
            name:'login',
          })
          .then(res=>{
            console.log('User\'s information:',res)
            // this.setState({
            //   userInfo:res.result
            // })
          })
          .catch(console.log)
    }
    getUserInfo(e) {
      console.log(e)
      Taro.cloud.init()
      const { detail } = e
      if (detail.errMsg.endsWith('ok')) {
        const userInfo = JSON.parse(detail.rawData)
        const { nickName, gender, avatarUrl } = userInfo
        Taro.cloud
          .callFunction({
            name: 'postUserInfo',
            data: {
              name: nickName,
              gender: gender,
              avatarUrl: avatarUrl,
            },
          })
          .then(res => {
            console.log(res)
            this.login()
          })
      }
    }
    componentDidMount () {}
    constructor(){
      super(...arguments)
      this.state = {
        current:0,
      }
    }
    createsche(){
      // console.log("!!")
      Taro.navigateTo({
        url:'../createSchedule/createSchedule'
      })
    }
    handleClick(value){
      if(this.islist){
        // console.log("?")
        Taro.navigateTo({
          url:'../scheduleDetail/scheduleDetail'
        })
      }else{
        this.setState({
        current:value
      })
      }

    }
    render() {
      const tabList=[{title:'我组织的'},{title:'我参与的'}]
        return (
          <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
            <AtTabsPane current={this.state.current} index={0} >
            <AtList>
              <AtListItem
                arrow='right'
                note='description'
                title='活动title'
                extraText=''
                onClick={this.handleClick}
              />
            </AtList>
            <Button
              openType="getUserInfo"
              onGetUserInfo={this.getUserInfo}
            >
              授权
            </Button>
            <View className="post-button">
              <AtFab onClick={this.createsche}>
                <Text className='at-fab__icon at-icon at-icon-menu'></Text>
              </AtFab>
            </View>
            </AtTabsPane>

            <AtTabsPane current={this.state.current} index={1}>
              <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
            </AtTabsPane>
          </AtTabs>

          // <View className="index">
          //     <View>
          //         <Text>这里是首页，用户刚进来会先被要求登入（或验证登陆）</Text>
          //         <Text>登入成功后，后端发送这个用户的这些信息：</Text>
          //         <Text>1. 个人信息</Text>
          //         <Text>2. 创立的班表信息</Text>
          //         <Text>3. 参加的班表信息</Text>
          //         <Text>到小程序并储存到 store 的 userData 中</Text>
          //     </View>
          //     <View>
          //         <Text>用户从这个页面可以做这些事情</Text>
          //         <Text>1. 点击进入自己创建的班表</Text>
          //         <Text>2. 点击进入自己参加的班表</Text>
          //         <Text>3. 创建新的班表</Text>
          //     </View>
          // </View>

        );
    }
}

export default Index as ComponentClass;
