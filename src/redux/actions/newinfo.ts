import newinfo from "src/classes/newinfo";
import { UPDATE_NEWINFO, DELETE_NEWINFO } from "../constants/newinfo";

interface updatenewInfo {
    type: typeof UPDATE_NEWINFO;
    data: newinfo;
}

interface deletenewInfo {
    type: typeof DELETE_NEWINFO;
    data: string;
}

/** 对 Redux 中 info 数据的 Actions */
export type NewinfoActions = updatenewInfo | deletenewInfo;

/** 将新的 newInfo 存入 Redux （或是覆写原有的 newInfo) */
export function updatenewInfo(data: newinfo): updatenewInfo {
    return { type: UPDATE_NEWINFO, data: data };
}

export function deletenewInfo(data: string): deletenewInfo {
    return { type: DELETE_NEWINFO, data: data };
}
