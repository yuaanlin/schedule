import newinfo from "../../classes/newinfo";
import { NewinfoActions } from "../actions/newinfo";
import { UPDATE_NEWINFO, DELETE_NEWINFO } from "../constants/newinfo";

/** 已经从数据库下载的 info 数据 */
export default function newinfos(state: Array<newinfo> = [], action: NewinfoActions) {
    switch (action.type) {
        case UPDATE_NEWINFO:
            return [...state.filter(newinfo => newinfo._id !== action.data._id), action.data];
        case DELETE_NEWINFO:
            return [...state.filter(newinfo => newinfo._id !== action.data)];
        default:
            return state;
    }
}
