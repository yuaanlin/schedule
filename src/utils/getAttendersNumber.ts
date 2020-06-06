import store from "../redux/store";

export default function getAttendersNumber(scheID: string) {
    var need_num = 0;
    store.getState().bancis.map(b => {
        if (b.scheid === scheID) need_num += b.count;
        return null;
    });
    var joined_num = 0;
    store.getState().infos.map(i => {
        if (i.scheid === scheID) joined_num++;
        return null;
    });
    return { need_num: need_num, joined_num: joined_num };
}
