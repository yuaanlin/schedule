import info from "src/classes/info";
import { DELETE_INFO, UPDATE_INFO } from "../constants/info";

interface updateInfo {
    type: typeof UPDATE_INFO;
    data: info;
}

interface deleteInfo {
    type: typeof DELETE_INFO;
    data: string;
}

/** 对 Redux 中 info 数据的 Actions */
export type InfoActions = updateInfo | deleteInfo;

/** 将新的 Info 存入 Redux （或是覆写原有的 Info) */
export function updateInfo(data: info): updateInfo {
    return { type: UPDATE_INFO, data: data };
}

/** 从 Redux 删除 Info */
export function deleteInfo(data: string): deleteInfo {
    return { type: DELETE_INFO, data: data };
}
