import axios from 'axios';

class ApiService {
    // static URLL = "https://appapi.youguide.com"
    // static baseURL = ApiService.URLL + '/api'; // Set your base URL here
    // static documentURL = "https://appapi.youguide.com" + '/';

    static URLL = "http://localhost:5000"
    static baseURL = ApiService.URLL + '/api'; // Set your base URL here
    static documentURL = "http://localhost:5000" + '/';

    static async loginUser(data) {
        try {
            const response = await axios.post(`${this.baseURL}/users/login`, data, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error login user:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllRoles() {
        try {
            const response = await axios.get(`${this.baseURL}/roles`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteRole(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/roles/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async convertPDFToHTML(path) {
        try {
            const response = await axios.get(`${this.baseURL}/vendor-subscription/convert?book_id=${path}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async checkVendorSubscriptionExpiry(id) {
        try {
            const response = await axios.get(`${this.baseURL}/vendor-subscription/checkExpiry?id=${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createRole(data) {
        try {
            const response = await axios.post(`${this.baseURL}/roles`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error role create:', error.response?.data || error.message);
            throw error;
        }
    }

    static async editRole(data, id) {
        try {
            const response = await axios.put(`${this.baseURL}/roles/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error role create:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllVendorSubscriptions() {
        try {
            const response = await axios.get(`${this.baseURL}/vendor-subscription`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllAffiliateSubscriptions() {
        try {
            const response = await axios.get(`${this.baseURL}/affiliates`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateByID(id) {
        try {
            const response = await axios.get(`${this.baseURL}/affiliates/book/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async saveAffiliateSubscription(data) {
        try {
            const response = await axios.post(`${this.baseURL}/affiliates`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteAffiliateSubsubscription(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/affiliates/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllAffiliateSubsciptionBooks(id, page, query, language = "en", limit = 8) {
        try {
            const response = await axios.get(`${this.baseURL}/affiliates/books?affiliateId=${id}&page=${page}&lang=${language}&query=${query}&limit=${limit}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllSubsciptionBooks(id, page, query, language = "en", limit = 8) {
        try {
            const response = await axios.get(`${this.baseURL}/vendor-subscription/books?vendorSubscriptionID=${id}&page=${page}&lang=${language}&query=${query}&limit=${limit}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }


    static async getVendorBookByID(id) {
        try {
            const response = await axios.get(`${this.baseURL}/vendor-subscription/findVendorBook?id=${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }



    static async saveVendorSubsubscription(data) {
        try {
            const response = await axios.post(`${this.baseURL}/vendor-subscription`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteVendorSubsubscription(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/vendor-subscription/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendorSubscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllCategories() {
        try {
            const response = await axios.get(`${this.baseURL}/categories`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteCategory(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/categories/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createCategory(data) {
        try {
            const response = await axios.post(`${this.baseURL}/categories`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error role create:', error.response?.data || error.message);
            throw error;
        }
    }

    static async editCategory(data, id) {
        try {
            const response = await axios.put(`${this.baseURL}/categories/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error role create:', error.response?.data || error.message);
            throw error;
        }
    }


    static async getAllUsers() {
        try {
            const response = await axios.get(`${this.baseURL}/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get users:', error.response?.data || error.message);
            throw error;
        }
    }


    static async deleteUser(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/users/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createUser(data) {
        try {
            const response = await axios.post(`${this.baseURL}/users`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error role create:', error.response?.data || error.message);
            throw error;
        }
    }

    static async editUser(data, id) {
        try {
            const response = await axios.put(`${this.baseURL}/users/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error role create:', error.response?.data || error.message);
            throw error;
        }
    }

    // Create a new book
    static async createBook(data) {
        try {
            const response = await axios.post(`${this.baseURL}/books`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // If there are files in the payload
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating book:', error.response?.data || error.message);
            throw error;
        }
    }

    // Fetch all books with their categories
    static async getAllBooks(page = 1, language = "en", query = "") {
        try {
            const response = await axios.get(`${this.baseURL}/books?page=${page}&language=${language}&query=${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllTransactions() {
        try {
            const response = await axios.get(`${this.baseURL}/books/purchases`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get roles:', error.response?.data || error.message);
            throw error;
        }
    }

    // Fetch a single book by ID with category
    static async getBookById(id) {
        try {
            const response = await axios.get(`${this.baseURL}/books/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching book with ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }

    // Update a book by ID
    static async updateBook(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/books/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // If there are files in the payload
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating book with ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }

    static async uploadBook(data) {
        try {
            const response = await axios.post(`${this.baseURL}/books/upload`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // If there are files in the payload
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error uploading book`, error.response?.data || error.message);
            throw error;
        }
    }

    static async uploadBookPDF(id, data) {
        try {
            const response = await axios.post(`${this.baseURL}/books/${id}/upload-pdf`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // If there are files in the payload
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error uploading book`, error.response?.data || error.message);
            throw error;
        }
    }

    // Delete a book by ID
    static async deleteBook(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/books/${id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data', // If there are files in the payload
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting book with ID ${id}:`, error.response?.data || error.message);
            throw error;
        }
    }
}

export default ApiService;
