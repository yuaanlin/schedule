/** 用户 */
export default class User {
    _id: string;
    avatarUrl: string;
    gender: number;
    name: string;
    constructor(user: User = initUser) {
        this._id = user._id;
        this.avatarUrl = user.avatarUrl;
        this.gender = user.gender;
        this.name = user.name;
    }
}

const initUser = {
    _id: "",
    avatarUrl: "",
    gender: 1,
    name: ""
};
