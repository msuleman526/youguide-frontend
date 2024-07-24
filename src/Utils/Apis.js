import axios from "axios";

export const API_URL = "https://thedinkumapi.azurewebsites.net"

//All API URLs
export const REGISTER_USER_API = `${API_URL}/api/admin/UserRegistration/RegisterUser`
export const ADD_BANK_API = `${API_URL}/api/admin/Setting/SaveBankDetails`
export const ADD_BANK_ACCOUNT_API = `${API_URL}/api/admin/Setting/SaveBankAccountDetails`
export const GET_BANK_BY_ID_API = `${API_URL}/api/admin/Setting/GeBankDetailsById`
export const GET_BANK_LIST_API = `${API_URL}/api/admin/Setting/GetBankList`
export const GET_BANK_ACCOUNTS_LIST_API = `${API_URL}/api/admin/Setting/GetBankAccountList`
export const GET_BANK_ACCOUNT_BY_ID_API = `${API_URL}/api/admin/Setting/GeBankAccountDetailsById`


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

export const ADD_UPDATE_BANK = (data) => {
    let requestData = JSON.stringify(data);

    console.log(requestData)

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: ADD_BANK_API,
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

export const ADD_UPDATE_BANK_ACCOUNT = (data) => {
    let requestData = JSON.stringify(data);

    console.log(requestData)

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: ADD_BANK_ACCOUNT_API,
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

export const GET_BANK_LIST = () => {
    let requestData = JSON.stringify({
        "isActive": null,
        "name": "",
        "isExport": true,
        "pagination": {
            "pageNo": 0,
            "pageSize": 0,
            "sortBy": "",
            "orderBy": ""
        }
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: GET_BANK_LIST_API,
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


export const GET_BANK_ACCOUNTS_LIST = (bankID) => {
    let requestData = JSON.stringify({
        "isActive": null,
        "name": "",
        "bankId": bankID,
        "isExport": true,
        "pagination": {
            "pageNo": 0,
            "pageSize": 0,
            "sortBy": "",
            "orderBy": ""
        }
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: GET_BANK_ACCOUNTS_LIST_API,
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

export const GET_BANK_BY_ID = (bankID) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GET_BANK_BY_ID_API + "?bankID=" + bankID,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export const GET_BANK_ACCOUNT_BY_ID = (bankID) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GET_BANK_ACCOUNT_BY_ID_API + "?bankAccountID=" + bankID,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}