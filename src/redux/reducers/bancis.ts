import { ScheduleDataActions } from "../actions/schedule";
import { UPDATE_SCHEDULE } from "../constants/schedule";
import Banci from "src/classes/banci";

/** 已经从数据库下载的 banci 数据 */
export default function bancis(state: Array<Banci> = [], action: ScheduleDataActions) {
    switch (action.type) {
        // case UPDATE_SCHEDULE:
            // return [...state.filter(banci => banci.id !== action.data.id), action.data];
        default:
            return state;
    }
}
