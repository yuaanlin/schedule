import { View } from "@tarojs/components";
import { Component } from "@tarojs/taro";
import { AtBadge, AtButton } from "taro-ui";
import info from "../classes/info";

interface Props {
    infos: Array<info>;
    banciID: string;
}

export default class UserBadge extends Component<Props> {
    render() {
        return (
            <View>
                {this.props.infos.map(x => {
                    if (x.classid === this.props.banciID)
                        return (
                            <AtBadge key={x._id}>
                                <AtButton size="small">{x.tag}</AtButton>
                            </AtBadge>
                        );
                })}
            </View>
        );
    }
}
