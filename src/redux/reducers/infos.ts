import info from "../../classes/info";
import { InfoActions } from "../actions/info";
import { DELETE_INFO, UPDATE_INFO } from "../constants/info";

/** 已经从数据库下载的 info 数据 */
export default function infos(state: Array<info> = [], action: InfoActions) {
    switch (action.type) {
        case UPDATE_INFO:
            return [...state.filter(info => info._id !== action.data._id), action.data];
        case DELETE_INFO:
            return [...state.filter(info => info._id !== action.data)];
        default:
            return state;
    }
}
