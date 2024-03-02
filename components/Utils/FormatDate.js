import { format, parseISO } from 'date-fns';
import moment from 'moment';
import 'moment/locale/vi';

export const formatDateForInput = (dateTime) => {
    const date = parseISO(dateTime);
    const formattedDate = format(date, 'yyyy-MM-dd');
    return formattedDate;
};

export const formatDateForHtml = (dateTime) => {
    const formattedDate = format(new Date(dateTime), 'yyyy-MM-dd');
    return formattedDate;
};

export const formateDateTime = (text) => {
    const dateTime = moment(text, 'YYYY-MM-DD HH:mm:ss.SSS');
    const formattedDateString = dateTime.format('D MMMM YYYY h:mm A');
    const splittedDate = formattedDateString.split(' ');
    const datePart = splittedDate.slice(0, 3).join(' ');
    const timePart = splittedDate.slice(3).join(' ');
    return {
        datePart: datePart,
        timePart: timePart,
    };
};

export const formateDateTimeVN = (text) => {
    // Định nghĩa múi giờ cho Việt Nam (Asia/Ho_Chi_Minh)
    moment.locale('vi');

    // Định dạng ngày tháng năm và giờ
    // const vietnamDateTime = moment(text).format('D MMMM YYYY');
    const datePart = moment(text).format('D MMMM YYYY');
    const timePart = moment(text).format('HH:mm');

    return {
        datePart: datePart,
        timePart: timePart,
    };
};
