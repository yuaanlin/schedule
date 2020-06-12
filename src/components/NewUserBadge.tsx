import { View } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import { AtListItem, AtList } from "taro-ui";
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

export default class NewUserBadge extends Component<Props> {
    Delete(info_id: string, user_id: string) {
        Taro.showToast({ title: "移除中", icon: "loading", duration: 2000 });

        if (this.props.user._id === this.props.schedule.ownerID) {
            Taro.showToast({ title: '云函数 "DeleteNewInfo" 还没开发好 ', icon: "none", duration: 2000 });
            /** Taro.cloud
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
                }); */
        } else {
            Taro.showToast({ title: "只有班表拥有者可以调整已发布的班表", icon: "none", duration: 2000 });
        }
    }

    render() {
        if (this.props.newinfos === undefined) return <View />;
        return this.props.newinfos ? (
            <AtList>
                {this.props.newinfos.map(x => {
                    if (x.classid === this.props.banciID)
                        return <AtListItem key={x._id} title={x.tag} onClick={this.Delete.bind(this, x._id, x.userid)} />;
                })}
            </AtList>
        ) : (
            <View />
        );
    }
}
