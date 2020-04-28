import Banci from "src/classes/Banci";
import { UPDATE_BANCI } from "../constants/banci";

interface updateBanci {
    type: typeof UPDATE_BANCI;
    data: Banci;
}

/** Redux 中操作 Banci 数据的 Actions */
export type BanciActions = updateBanci;

/** 将新的 Banci 存入 Redux （或是覆写原有的 Banci) */
export function updateBanci(data: Banci) {
    return { type: UPDATE_BANCI, data: data };
}
