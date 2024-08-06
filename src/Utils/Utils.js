import { message } from "antd";

export const handleErrors = (type, err) => {
    const error = err.response?.data;
    try {
        if (error && !error.isSuccess && error.data) {
            try {
                error.data.forEach((val) => {
                    message.error(val.errorMessage);
                });
            } catch (e) {
                message.error(error.message || 'There is some issue in registration.');
            }
        } else {
            message.error(error.message || 'There is some issue in ' + type);
        }
    } catch (errr) {
        message.error(error?.message || 'There is some issue in ' + type);
    }
}


export const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const convertDateToNormal = (datee) => {
    const date = new Date(datee);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate
}

export const convertDateToDateTime = (datee) => {

    const date = new Date(datee);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

    return formattedDate
}

export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00.000`;
};