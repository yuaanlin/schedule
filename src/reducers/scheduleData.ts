import Schedule from "../classes/schedule";
import { ScheduleDataActions } from "../actions/scheduleData";
import { SET_SCHEDULE_DATA } from "../constants/scheduleData";

/** 当前查看的班表数据 */
export default function scheduleData(state = new Schedule(), action: ScheduleDataActions) {
    switch (action.type) {
        case SET_SCHEDULE_DATA:
            return action.scheduleData;
        default:
            return state;
    }
}
