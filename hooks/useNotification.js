import { notification } from 'antd';

function useNotification() {
    const showError = (title, message, time) => {
        notification.error({
            message: title,
            description: message,
            duration: time,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };

    const showSuccess = (title, message, time) => {
        notification.success({
            message: title,
            description: message,
            duration: time,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };

    const showWarning = (title, message, time) => {
        notification.warning({
            message: title,
            description: message,
            duration: time,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };

    return { showError, showSuccess, showWarning };
}

export default useNotification;
