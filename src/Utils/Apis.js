import axios from "axios";
import { formatDate } from "./Utils";

//export const API_URL = "https://thedinkumapi.azurewebsites.net"
export const API_URL = "https://dinkum.netlify.app"

//All API URLs
export const REGISTER_USER_API = `${API_URL}/api/admin/UserRegistration/RegisterUser`
export const ADD_BANK_API = `${API_URL}/api/admin/Setting/SaveBankDetails`
export const ADD_BANK_ACCOUNT_API = `${API_URL}/api/admin/Setting/SaveBankAccountDetails`
export const GET_BANK_BY_ID_API = `${API_URL}/api/admin/Setting/GeBankDetailsById`
export const GET_BANK_LIST_API = `${API_URL}/api/admin/Setting/GetBankList`
export const GET_BANK_ACCOUNTS_LIST_API = `${API_URL}/api/admin/Setting/GetBankAccountList`
export const GET_BANK_ACCOUNT_BY_ID_API = `${API_URL}/api/admin/Setting/GeBankAccountDetailsById`

//Categories and Groups 
export const GET_CATEGORIES_LIST_API = `${API_URL}/api/admin/Setting/GetCategoryList`
export const GET_CATEGORY_GROUP_BY_ID_API = `${API_URL}/api/admin/Setting/GetCategoryGroupDetailsById`
export const ADD_CATEGORY_GROUP_API = `${API_URL}/api/admin/Setting/SaveCategoryGroupDetails`
export const GET_SECTIONS_LIST_API = `${API_URL}/api/admin/Setting/GetCategorySectionsList`
export const GET_CATEGORY_GROUP_LIST_API = `${API_URL}/api/admin/Setting/GetCategoryGroupsList`
export const GET_CATEGORY_BY_ID_API = `${API_URL}/api/admin/Setting/GetCategoryDetailsById`
export const ADD_CATEGORY_API = `${API_URL}/api/admin/Setting/SaveCategoryDetails`

//Upload Transactions
export const UPLOAD_TRANSACTION_FILE_API = `${API_URL}/api/admin/Upload/UploadTransactionsFile`
export const UPLOADED_FILES_LIST = `${API_URL}/api/admin/Upload/GetUploadedFilesList`
export const GET_TRANSACTION_LIST_API = `${API_URL}/api/Transaction/GetTransactionsList`

//Transaction
export const GET_TRANSACTION_YEARS_API = `${API_URL}/api/Transaction/GetTransactionYearMonthsList`
export const UPDATE_TRANSACTION_CATEGORY_API = `${API_URL}/api/Transaction/UpdateTransactionCategory`

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
        "isExport": null,
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



export const GET_CATEGORIES_LIST = (groupID) => {
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
        url: GET_CATEGORIES_LIST_API,
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


export const GET_CATEGORY_GROUP_BY_ID = (groupID) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GET_CATEGORY_GROUP_BY_ID_API + "?categoryGroupID=" + groupID,
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

export const GET_CATEGORY_BY_ID = (categoryID) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GET_CATEGORY_BY_ID_API + "?categoryID=" + categoryID,
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


export const ADD_UPDATE_CATEGORY_GROUP = (data) => {
    let requestData = JSON.stringify(data);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: ADD_CATEGORY_GROUP_API,
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

export const ADD_UPDATE_CATEGORY = (data) => {
    let requestData = JSON.stringify(data);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: ADD_CATEGORY_API,
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

export const GET_SECTIONS_LIST = () => {
    let requestData = JSON.stringify({
        "isActive": null,
        "name": "",
        "isExport": null,
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
        url: GET_SECTIONS_LIST_API,
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

export const GET_CATEGORY_GROUPS_LIST = () => {
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
        url: GET_CATEGORY_GROUP_LIST_API,
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

export const UPLOAD_TRANSACTION_FILE = (data) => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: UPLOAD_TRANSACTION_FILE_API,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: data
    };

    return axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export const GET_UPLOADED_FILES_LIST = () => {

    const currentDate = new Date();
    const currentDateTime = formatDate(currentDate);

    let requestData = JSON.stringify({
        "fileName": "",
        "importedOn": null,
        "bankId": 0,
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
        url: UPLOADED_FILES_LIST,
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

export const GET_TRANSACTION_LIST = (data) => {
    let requestData = JSON.stringify(data);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: GET_TRANSACTION_LIST_API,
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

export const GET_TRANSACTION_YEARS_LIST = () => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GET_TRANSACTION_YEARS_API,
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

export const UPDATE_TRANSACTION_CATEGORY = (categoryID, transactionID) => {
    let requestData = JSON.stringify({
        "transactionId": transactionID,
        "categoryId": categoryID,
    });
    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: UPDATE_TRANSACTION_CATEGORY_API,
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