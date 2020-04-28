import Schedule from "../../classes/schedule";
import { ScheduleDataActions } from "../actions/schedule";
import { UPDATE_SCHEDULE } from "../constants/schedule";

/** 已经从数据库下载的班表数据 */
export default function schedules(state: Array<Schedule> = [], action: ScheduleDataActions) {
    switch (action.type) {
        case UPDATE_SCHEDULE:
            return [...state.filter(sche => sche.id !== action.data.id), action.data];
        default:
            return state;
    }
}
