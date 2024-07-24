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