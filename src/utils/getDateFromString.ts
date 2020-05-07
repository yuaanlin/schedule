export default function getDateFromString(dateString: string) {
    const year = +dateString.split("-")[0];
    const month = +dateString.split("-")[1];
    const date = +dateString.split("-")[2];
    var newDate = new Date();
    newDate.setFullYear(year);
    newDate.setMonth(month - 1);
    newDate.setDate(date);
    return newDate;
}
