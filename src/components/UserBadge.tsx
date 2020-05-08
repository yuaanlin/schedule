import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";
import { AtBadge, AtButton } from "taro-ui";
import info from "../classes/info";
import User from "../classes/User"

interface Props {
    user: User;
    infos: Array<info>;
    banciID: string;
}

export default class UserBadge extends Component<Props> {
  Delete(info_id,user_id){
    // var infor = this.props.infos
    if(user_id===this.props.user._id){
      // for(var i=0;i<infor.length;i++){
      //   if(infor[i]._id===info_id){
      //     infor.splice(i,1)
      //   }
      // }
      console.log(info_id)
      Taro.cloud
       .callFunction({
         name: "deleteinfo",
         data: {
           infoid:info_id
         }
       }).then(res => {
         console.log(res)
         if(res.result.code===200){
          Taro.showToast({ title: "移除成功", icon: "success", duration: 2000 });
         }
       })
    }else{
      Taro.showToast({ title: "您无权限编辑他人的班次选择噢", icon: "none", duration: 2000 });
    }
  }
    render() {
        return (
            <View>
                {this.props.infos.map(x => {
                    if (x.classid === this.props.banciID)
                        return (
                            <AtBadge key={x._id}>
                                <AtButton size="small" onClick={this.Delete.bind(this,x._id,x.userid)}>{x.tag}</AtButton>
                            </AtBadge>
                        );
                })}
            </View>
        );
    }
}
