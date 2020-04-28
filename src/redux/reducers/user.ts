import { SET_USER_DATA } from "../constants/user";
import User from "../../classes/user";
import { UserActions } from "../actions/user";

/** 当前用户的数据 */
export default function user(state = new User(""), action: UserActions) {
    switch (action.type) {
        case SET_USER_DATA:
            return action.data;
        default:
            return state;
    }
}
