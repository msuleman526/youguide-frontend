import axios from "axios";

export const API_URL = "https://thedinkumapi.azurewebsites.net"

//Register User API URL
export const REGISTER_USER_API = `${API_URL}/api/admin/UserRegistration/RegisterUser`

//Register User Axios Call
export const REGISTER_USER = (data) => {
    let requestData = JSON.stringify(data);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: REGISTER_USER_API,
        headers: {
            'Content-Type': 'application/json',
        },
        data: requestData
    };

    return axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}