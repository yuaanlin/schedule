export default function getDateString(date: Date, useChinese: boolean) {
    if (useChinese) return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
    else return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}
