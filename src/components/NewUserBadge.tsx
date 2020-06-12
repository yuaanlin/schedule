import { View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import { AtBadge, AtButton, AtListItem } from "taro-ui";
import newinfo from "../classes/newinfo";
import User from "../classes/User";
import Schedule from "../classes/Schedule";
import { deleteinfoResult } from "../types";

interface Props {
    user: User;
    newinfos: Array<newinfo>;
    banciID: string;
    schedule: Schedule;
    deleteInfo: (id: string) => void;
    updateAttendersNumber: () => void;
}

export default class UserBadge extends Component<Props> {
    Delete(info_id: string, user_id: string) {
        Taro.showToast({ title: "移除中", icon: "loading", duration: 2000 });

        if (user_id === this.props.user._id || this.props.user._id === this.props.schedule.ownerID) {
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
                    this.props.updateAttendersNumber();
                });
        } else {
            Taro.showToast({ title: "您无权限编辑他人的班次选择噢", icon: "none", duration: 2000 });
        }
    }

    render() {
        if (this.props.newinfos === undefined) return <View />;
        return this.props.newinfos ? (
            <View>
                {this.props.newinfos.map(x => {
                    if (x.classid === this.props.banciID)
                        return (
                            <AtListItem key={x._id} title={x.tag}>
                                {/* <AtButton size="small" onClick={this.Delete.bind(this, x._id, x.userid)}>
                                </AtButton> */}
                            </AtListItem>
                        );
                })}
            </View>
        ) : (
            <View></View>
        );
    }
}
