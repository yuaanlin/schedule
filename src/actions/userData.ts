import { SET_USER_DATA } from "../constants/userData";
import User from "src/classes/user";

interface setUserData {
    type: typeof SET_USER_DATA;
    userData: User;
}

export type UserDataActions = setUserData;
