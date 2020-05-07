import store from "../redux/store";

export default function checkIfInvolved(userID: string, banciID: string) {
    var found = false;
    store.getState().infos.map(info => {
        if (info.classid === banciID && info.userid === userID) {
            found = true;
        }
    });
    return found;
}
