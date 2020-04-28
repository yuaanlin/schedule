import { SET_USER_DATA } from "../constants/user";
import User from "src/classes/user";

interface setUserData {
    type: typeof SET_USER_DATA;
    data: User;
}

/** 对 Redux 中操作 User 数据的 Actions */
export type UserActions = setUserData;

/** 将新的 User 存入 Redux （或是覆写原有的 User) */
export function setUserData(user: User) {
    return { type: SET_USER_DATA, data: user };
}
