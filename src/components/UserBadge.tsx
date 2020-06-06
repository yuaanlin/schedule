import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";
import { AtBadge, AtButton } from "taro-ui";
import info from "../classes/info";
import User from "../classes/User";
import Schedule from "../classes/Schedule";
import { deleteinfoResult } from "../types";

interface Props {
    user: User;
    infos: Array<info>;
    banciID: string;
    schedule:Schedule;
    deleteInfo: (id: string) => void;
}

export default class UserBadge extends Component<Props> {
    Delete(info_id: string, user_id: string) {
        Taro.showToast({ title: "移除中", icon: "loading", duration: 2000 });
        if (user_id === this.props.user._id || user_id === this.props.schedule.ownerID) {
            Taro.cloud
                .callFunction({
                    name: "deleteinfo",
                    data: {
                        infoid: info_id
                    }
                })
                .then(res => {
                    const resdata = (res as unknown) as deleteinfoResult;
                    if (resdata.result.code === 200) {
                        Taro.showToast({ title: "移除成功", icon: "success", duration: 2000 });
                    }
                    this.props.deleteInfo(info_id);
                });
        } else {
            Taro.showToast({ title: "您无权限编辑他人的班次选择噢", icon: "none", duration: 2000 });
        }
    }

    render() {
        return (
          this.props.infos?(
            <View>
                {this.props.infos.map(x => {
                    if (x.classid === this.props.banciID)
                        return (
                            <AtBadge key={x._id}>
                                <AtButton size="small" onClick={this.Delete.bind(this, x._id, x.userid)}>
                                    {x.tag}
                                </AtButton>
                            </AtBadge>
                        );
                })}
            </View>
          ):(
            <View></View>
          )

        );
    }
}
