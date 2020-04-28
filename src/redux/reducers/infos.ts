import { ScheduleDataActions } from "../actions/schedule";
import { UPDATE_SCHEDULE } from "../constants/schedule";
import info from "../../classes/info";

/** 已经从数据库下载的 info 数据 */
export default function infos(state: Array<info> = [], action: ScheduleDataActions) {
    switch (action.type) {
        case UPDATE_SCHEDULE:
            return [...state.filter(info => info.id !== action.data.id), action.data];
        default:
            return state;
    }
}
