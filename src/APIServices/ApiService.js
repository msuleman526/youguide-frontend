import axios from 'axios';
// LOCAL DEV: true -> http://localhost:5001, false -> https://appapi.youguide.com
// NOTE: this is a tracked file. Set back to false before committing or the
// deployed build will point at localhost.
const isDev = false

class ApiService {
    static URLL = !isDev ? "https://appapi.youguide.com" : 'http://localhost:5001'
    static baseURL = ApiService.URLL + '/api'; // Set your base URL here
    documentURL = "https://appapi.youguide.com" + '/';
    //static documentURL = "http://localhost:5001" + '/';

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


    static async checkAffiliateSubscriptionExpiry(id) {
        try {
            const response = await axios.get(`${this.baseURL}/affiliates/checkExpiry?id=${id}`, {
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

    static async openVendorBookOneTime(id) {
        try {
            const response = await axios.get(`${this.baseURL}/vendor-subscription/one-view?id=${id}`, {
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


    static async openAffiliateBookOneTime(id) {
        try {
            const response = await axios.get(`${this.baseURL}/affiliates/one-view?id=${id}`, {
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

    static async getTeams() {
        try {
            const response = await axios.get(`${this.baseURL}/teams`, {
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

    static async saveTeamAdmin(data) {
        try {
            const response = await axios.post(`${this.baseURL}/team-admin`, data, {
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

    static async saveTeamUser(data) {
        try {
            const response = await axios.post(`${this.baseURL}/team-user`, data, {
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

    static async updateTeamLimit(teamAdminId, data) {
        try {
            const response = await axios.patch(`${this.baseURL}/team-admin/${teamAdminId}/limit`, data, {
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


    static async updateTeamStatus(userId, data) {
        try {
            const response = await axios.patch(`${this.baseURL}/user/${userId}/status`, data, {
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

    static async getAffiliateByUserId(userId) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/affiliates/by-user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                },
            });
            return response.data;
        } catch (error) {
            // Return null if not found (404)
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Error getting affiliate by user:', error.response?.data || error.message);
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

    static async updateAffiliateSubscription(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/affiliates/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating affiliate subscription:', error.response?.data || error.message);
            throw error;
        }
    }

    static async extendAffiliateSubscription(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/affiliates/extend/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error extend affiliate subscription:', error.response?.data || error.message);
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

    // Hotel API methods
    static async getHotelsByAffiliate(affiliateId) {
        try {
            const response = await axios.get(`${this.baseURL}/hotels/affiliate/${affiliateId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get hotels:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getHotelById(id) {
        try {
            const response = await axios.get(`${this.baseURL}/hotels/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get hotel:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createHotel(affiliateId, data) {
        try {
            const response = await axios.post(`${this.baseURL}/hotels/affiliate/${affiliateId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error create hotel:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateHotel(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/hotels/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error update hotel:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteHotel(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/hotels/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error delete hotel:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getHotelSubscriptionBooks(hotelId, page, query, language = "en", limit = 8) {
        try {
            const response = await axios.get(`${this.baseURL}/hotels/books/subscription?hotelId=${hotelId}&page=${page}&lang=${language}&query=${query}&limit=${limit}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get hotel books:', error.response?.data || error.message);
            throw error;
        }
    }

    static async checkHotelSubscriptionExpiry(hotelId) {
        try {
            const response = await axios.get(`${this.baseURL}/hotels/checkExpiry?hotelId=${hotelId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error check hotel expiry:', error.response?.data || error.message);
            throw error;
        }
    }

    static async openHotelBookOneTime(hotelId) {
        try {
            const response = await axios.get(`${this.baseURL}/hotels/one-view?hotelId=${hotelId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error hotel one view:', error.response?.data || error.message);
            throw error;
        }
    }

    // Affiliate Authentication API methods
    static async loginAffiliate(data) {
        try {
            const response = await axios.post(`${this.baseURL}/affiliates/login`, data, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error affiliate login:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateProfile() {
        try {
            const response = await axios.get(`${this.baseURL}/affiliates/profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("affiliateToken")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get affiliate profile:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getMyHotels() {
        try {
            const response = await axios.get(`${this.baseURL}/hotels/my-hotels`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("affiliateToken")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get my hotels:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createMyHotel(data) {
        try {
            const response = await axios.post(`${this.baseURL}/hotels/my-hotels`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("affiliateToken")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error create my hotel:', error.response?.data || error.message);
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
    static async getAllBooks(page = 1, language = "en", query = "", limit = 8) {
        try {
            const response = await axios.get(`${this.baseURL}/books?page=${page}&language=${language}&query=${query}&limit=200&pageSize=200`, {
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

    // Analytics API methods
    static async getDashboardStats(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/dashboard-stats`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get dashboard stats:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getUsersByRole(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/users-by-role`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get users by role:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getUsersOverTime(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/users-over-time`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get users over time:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getBooksByCategory(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/books-by-category`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get books by category:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getPurchaseTypeStats(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/purchase-type-stats`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get purchase type stats:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateClickStats(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/affiliate-click-stats`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get affiliate click stats:', error.response?.data || error.message);
            throw error;
        }
    }

    // Get affiliate-specific analytics for their dashboard
    static async getMyAffiliateAnalytics(timeRange = '30days') {
        try {
            const response = await axios.get(`${this.baseURL}/affiliates/analytics?timeRange=${timeRange}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("affiliateToken")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get my affiliate analytics:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getVendorClickStats(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/vendor-click-stats`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get vendor click stats:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getExpiredAffiliates(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/expired-affiliates`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get expired affiliates:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getExpiredVendors(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/expired-vendors`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get expired vendors:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getSalesByCategory(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/sales-by-category`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get sales by category:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getBooksByLanguage(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/books-by-language`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get books by language:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getPopularDestinations(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/popular-destinations`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get popular destinations:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getRevenueOverTime(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/revenue-over-time`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get revenue over time:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getTopPerformingBooks(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/top-performing-books`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get top performing books:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getPurchaseTrends(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/purchase-trends`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get purchase trends:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateVsVendorPerformance(startDate = null, endDate = null) {
        try {
            let url = `${this.baseURL}/analytics/affiliate-vs-vendor-performance`;
            if (startDate || endDate) {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get affiliate vs vendor performance:', error.response?.data || error.message);
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

    // Update book cover image only
    static async updateBookCover(bookId, data) {
        try {
            const response = await axios.put(`${this.baseURL}/books/${bookId}/updateCover`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating book cover:`, error.response?.data || error.message);
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

    // Language Guides
    static async createLanguageGuide(data) {
        try {
            const response = await axios.post(`${this.baseURL}/language-guides`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating language guide:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllLanguageGuides(page = 1, query = "") {
        try {
            const response = await axios.get(`${this.baseURL}/language-guides?page=${page}&query=${query}&pageSize=200`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching language guides:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateLanguageGuide(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/language-guides/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating language guide:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteLanguageGuide(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/language-guides/${id}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting language guide:', error.response?.data || error.message);
            throw error;
        }
    }

    // =================== Bundles ===================
    static async getBundles(params = {}) {
        try {
            const qs = new URLSearchParams(params).toString();
            const response = await axios.get(`${this.baseURL}/bundles${qs ? `?${qs}` : ''}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching bundles:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getBundleEsimOptions(search = '') {
        try {
            const response = await axios.get(`${this.baseURL}/bundles/esim-options?search=${encodeURIComponent(search)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching eSIM options:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createBundle(data) {
        try {
            const response = await axios.post(`${this.baseURL}/bundles`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating bundle:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateBundle(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/bundles/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating bundle:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteBundle(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/bundles/${id}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting bundle:', error.response?.data || error.message);
            throw error;
        }
    }

    static async extendHotelAffiliateSubscription(hotelId, data) {
        try {
            const response = await axios.put(`${this.baseURL}/hotels/extend/${hotelId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error extend hotel subscription:', error.response?.data || error.message);
            throw error;
        }
    }

    // Trip API methods
    static async listTrips(userId = null) {
        try {
            const url = `${this.baseURL}/trips/list${userId ? `?user_id=${userId}` : ''}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get trips:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getTripById(tripId) {
        try {
            const response = await axios.get(`${this.baseURL}/trips/${tripId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get trip:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getTripPointsByTrip(tripId) {
        try {
            const response = await axios.get(`${this.baseURL}/trip-points/trip/${tripId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get trip points:', error.response?.data || error.message);
            throw error;
        }
    }

    // API Access - Travel Content API methods
    static async getTravelGuideById(guideId, bearerToken) {
        try {
            const response = await axios.get(`${this.baseURL}/travel-content/guides/${guideId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get travel guide:', error.response?.data || error.message);
            throw error;
        }
    }

    static async downloadSecurePDF(guideId, transactionId, bearerToken) {
        try {
            const response = await axios.get(`${this.baseURL}/travel-guides/pdf/secure/download`, {
                params: {
                    guide_id: guideId,
                    transaction_id: transactionId
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error download secure PDF:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getSecureJsonData(guideId, transactionId, bearerToken) {
        try {
            const response = await axios.get(`${this.baseURL}/travel-guides/digital/secure/data`, {
                params: {
                    guide_id: guideId,
                    transaction_id: transactionId
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error get secure JSON data:', error.response?.data || error.message);
            throw error;
        }
    }

    static async viewSecureHtml(guideId, transactionId, bearerToken, options = {}) {
        try {
            const params = {
                guide_id: guideId,
                transaction_id: transactionId,
                ...options, // headings, heading_format, title_color, paragraph_color, paragraph_size, heading_size, sub_heading_size, sub_heading_color, title_size, mode
                hosted_page: 0 // Always 0, cannot be overridden
            };

            const response = await axios.get(`${this.baseURL}/travel-guides/digital/secure/view`, {
                params,
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                },
                responseType: 'text' // Expecting HTML text
            });
            return response.data;
        } catch (error) {
            console.error('Error view secure HTML:', error.response?.data || error.message);
            throw error;
        }
    }

    static async viewDigitalContentHtml(guideId, bearerToken, options = {}) {
        try {
            const params = {
                ...options, // headings, heading_format, title_color, paragraph_color, paragraph_size, heading_size, sub_heading_size, sub_heading_color, title_size, mode
                hosted_page: 0 // Always 0, cannot be overridden
            };

            const response = await axios.get(`${this.baseURL}/travel-guides/digital/content/view/${guideId}`, {
                params,
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                },
                responseType: 'text' // Expecting HTML text
            });
            return response.data;
        } catch (error) {
            console.error('Error view digital content HTML:', error.response?.data || error.message);
            throw error;
        }
    }

    // Request Form APIs
    static async submitRequest(data) {
        try {
            const response = await axios.post(`${this.baseURL}/request`, data, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting request:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllRequests(page = 1, limit = 20) {
        try {
            const response = await axios.get(`${this.baseURL}/requests/admin/list`, {
                params: { page, limit },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching requests:', error.response?.data || error.message);
            throw error;
        }
    }

    // Contact Form APIs
    static async submitContact(data) {
        try {
            const response = await axios.post(`${this.baseURL}/contact`, data, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting contact:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAllContacts(page = 1, limit = 20) {
        try {
            const response = await axios.get(`${this.baseURL}/contact/admin/list`, {
                params: { page, limit },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error.response?.data || error.message);
            throw error;
        }
    }

    // Newsletter APIs
    static async getAllNewsletters(page = 1, limit = 20) {
        try {
            const response = await axios.get(`${this.baseURL}/newsletter/admin/list`, {
                params: { page, limit },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching newsletters:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteNewsletter(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/newsletter/admin/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting newsletter:', error.response?.data || error.message);
            throw error;
        }
    }

    // API Access Management APIs
    static async getAllApiAccessTokens(page = 1, limit = 20, type = null, payment_type = null, user_id = null) {
        try {
            const params = { page, limit };
            if (type) params.type = type;
            if (payment_type) params.payment_type = payment_type;
            if (user_id) params.user_id = user_id;

            const response = await axios.get(`${this.baseURL}/api-access`, {
                params,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching API access tokens:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateApiAccessTokens(userId, page = 1, limit = 20) {
        try {
            const params = { page, limit, user_id: userId };

            const response = await axios.get(`${this.baseURL}/api-access`, {
                params,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('affiliateToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching affiliate API access tokens:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateApiAccessTokenStats(id) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/api-access/${id}/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching affiliate API access stats:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateApiAccessTokenLogs(id, page = 1, limit = 20) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/api-access/${id}/logs`, {
                params: { page, limit },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching affiliate API access logs:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateApiAccessDetailLogs(id, page = 1, limit = 50) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/api-access/${id}/detail-logs`, {
                params: { page, limit },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching affiliate API access detail logs:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createAffiliateApiAccessToken(data) {
        try {
            const response = await axios.post(`${this.baseURL}/api-access`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('affiliateToken')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating affiliate API access token:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateAffiliateApiAccessToken(id, data) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.put(`${this.baseURL}/api-access/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating affiliate API access token:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteAffiliateApiAccessToken(id) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.delete(`${this.baseURL}/api-access/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting affiliate API access token:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateApiAccessTokenStatsById(id) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/api-access/${id}/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching affiliate API access token stats:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createApiAccessToken(data) {
        try {
            const response = await axios.post(`${this.baseURL}/api-access`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating API access token:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getApiAccessTokenById(id) {
        try {
            const response = await axios.get(`${this.baseURL}/api-access/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching API access token:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateApiAccessToken(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/api-access/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating API access token:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteApiAccessToken(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/api-access/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting API access token:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getApiAccessTokenLogs(id, page = 1, limit = 20) {
        try {
            const response = await axios.get(`${this.baseURL}/api-access/${id}/logs`, {
                params: { page, limit },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching API access logs:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getApiAccessTokenStats(id) {
        try {
            const response = await axios.get(`${this.baseURL}/api-access/${id}/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching API access stats:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateQuotaDetails(userId) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/affiliates/quota-details/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching affiliate quota details:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAffiliateTokenSummary(userId) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/affiliates/token-summary/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching affiliate token summary:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getApiAccessDetailLogs(id, page = 1, limit = 50) {
        try {
            const response = await axios.get(`${this.baseURL}/api-access/${id}/detail-logs`, {
                params: { page, limit },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching API access detail logs:', error.response?.data || error.message);
            throw error;
        }
    }

    // Quota Package APIs
    static async getQuotaPackageDetails(affiliateId) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.get(`${this.baseURL}/quota-package/${affiliateId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching quota package details:', error.response?.data || error.message);
            throw error;
        }
    }

    static async checkoutQuotaPackage(data) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.post(`${this.baseURL}/quota-package/checkout`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error initiating quota package checkout:', error.response?.data || error.message);
            throw error;
        }
    }

    // Coupon APIs
    static async getAllCoupons() {
        try {
            const response = await axios.get(`${this.baseURL}/coupons`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching coupons:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createCoupon(data) {
        try {
            const response = await axios.post(`${this.baseURL}/coupons`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating coupon:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateCoupon(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/coupons/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating coupon:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteCoupon(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/coupons/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting coupon:', error.response?.data || error.message);
            throw error;
        }
    }

    // Discount APIs
    static async getAllDiscounts() {
        try {
            const response = await axios.get(`${this.baseURL}/discounts`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching discounts:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createDiscount(data) {
        try {
            const response = await axios.post(`${this.baseURL}/discounts`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating discount:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateDiscount(id, data) {
        try {
            const response = await axios.put(`${this.baseURL}/discounts/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating discount:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteDiscount(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/discounts/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting discount:', error.response?.data || error.message);
            throw error;
        }
    }

    static async requestQuota(data) {
        try {
            const token = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
            const response = await axios.post(`${this.baseURL}/affiliates/request-quota`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error requesting quota:', error.response?.data || error.message);
            throw error;
        }
    }
    // ─── Amazon Orders ────────────────────────────────────────────────────

    static async getAmazonOrders(params = {}) {
        try {
            const response = await axios.get(`${this.baseURL}/amazon-orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Amazon orders:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAmazonOrder(id) {
        try {
            const response = await axios.get(`${this.baseURL}/amazon-orders/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Amazon order:', error.response?.data || error.message);
            throw error;
        }
    }

    static async resendAmazonOrderEmail(id, customer_email) {
        try {
            const response = await axios.post(`${this.baseURL}/amazon-orders/${id}/resend-email`, { customer_email }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error resending Amazon order email:', error.response?.data || error.message);
            throw error;
        }
    }

    static async sendAmazonMessage(id) {
        try {
            const response = await axios.post(`${this.baseURL}/amazon-orders/${id}/send-amazon-message`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error sending Amazon message:', error.response?.data || error.message);
            throw error;
        }
    }

    static async createAmazonEsimCheckout({ order_number, customer_email, amount }) {
        try {
            const response = await axios.post(`${this.baseURL}/amazon-orders/stripe-checkout`, { order_number, customer_email, amount }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating Amazon eSIM checkout:', error.response?.data || error.message);
            throw error;
        }
    }

    static async verifyAmazonOrder({ order_id, email }) {
        try {
            const response = await axios.post(`${this.baseURL}/amazon-orders/verify`, { order_id, email }, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        } catch (error) {
            console.error('Error verifying Amazon order:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAmazonOrderLogs(id) {
        try {
            const response = await axios.get(`${this.baseURL}/amazon-orders/${id}/logs`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Amazon order logs:', error.response?.data || error.message);
            throw error;
        }
    }

    static async updateAmazonOrderStatus(id, status) {
        try {
            const response = await axios.patch(`${this.baseURL}/amazon-orders/${id}/status`, { status }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating Amazon order status:', error.response?.data || error.message);
            throw error;
        }
    }

    static async getAmazonFreeGuide(orderNumber, pkgIndex = 0) {
        try {
            const response = await axios.get(`${this.baseURL}/amazon-orders/free-guide/${orderNumber}?pkg=${pkgIndex}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching free guide:', error.response?.data || error.message);
            throw error;
        }
    }

    // ===========================================================================
    // Affiliate v2 — links, sub-affiliates, payouts, earnings, Buy-Now
    // ===========================================================================

    static _adminHeaders() {
        return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') };
    }
    static _affiliateHeaders() {
        return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('affiliateToken') };
    }

    // ----- Affiliate Links -----
    static async requestAffiliateLink(payload) {
        const r = await axios.post(`${this.baseURL}/affiliate-links/request`, payload, { headers: this._affiliateHeaders() });
        return r.data;
    }
    static async getMyAffiliateLinks() {
        const r = await axios.get(`${this.baseURL}/affiliate-links/mine`, { headers: this._affiliateHeaders() });
        return r.data;
    }
    static async getPendingAffiliateLinks() {
        const r = await axios.get(`${this.baseURL}/affiliate-links/pending`, { headers: this._adminHeaders() });
        return r.data;
    }
    static async getAllAffiliateLinks(params = {}) {
        const r = await axios.get(`${this.baseURL}/affiliate-links`, { params, headers: this._adminHeaders() });
        return r.data;
    }
    static async approveAffiliateLink(id) {
        const r = await axios.post(`${this.baseURL}/affiliate-links/${id}/approve`, {}, { headers: this._adminHeaders() });
        return r.data;
    }
    static async rejectAffiliateLink(id, reason) {
        const r = await axios.post(`${this.baseURL}/affiliate-links/${id}/reject`, { reason }, { headers: this._adminHeaders() });
        return r.data;
    }
    static async deleteAffiliateLink(id) {
        const tok = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
        const r = await axios.delete(`${this.baseURL}/affiliate-links/${id}`, {
            headers: { Authorization: 'Bearer ' + tok },
        });
        return r.data;
    }
    static async getAffiliateLinkEvents(id, params = {}) {
        const tok = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
        const r = await axios.get(`${this.baseURL}/affiliate-links/${id}/events`, {
            params,
            headers: { Authorization: 'Bearer ' + tok },
        });
        return r.data;
    }
    static async getAffiliateLinkBySlug(slug, src) {
        const r = await axios.get(`${this.baseURL}/affiliate-links/by-slug/${slug}`, { params: { src } });
        return r.data;
    }
    static async getAffiliateLinkStats(id) {
        const tok = localStorage.getItem('affiliateToken') || localStorage.getItem('token');
        const r = await axios.get(`${this.baseURL}/affiliate-links/${id}/stats`, {
            headers: { Authorization: 'Bearer ' + tok },
        });
        return r.data;
    }
    static async getBooksByLinkSlug(slug, params = {}) {
        const r = await axios.get(`${this.baseURL}/affiliate-links/by-slug/${slug}/books`, { params });
        return r.data;
    }
    static async logAffiliateGuideOpen(payload) {
        const r = await axios.post(`${this.baseURL}/affiliate-links/log/guide-open`, payload);
        return r.data;
    }

    // ----- Sub-affiliates / inline user create -----
    static async createSubAffiliate(formData) {
        const r = await axios.post(`${this.baseURL}/affiliates/sub`, formData, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('affiliateToken') },
        });
        return r.data;
    }
    static async createAffiliateUserInline(payload) {
        const tok = localStorage.getItem('token') || localStorage.getItem('affiliateToken');
        const r = await axios.post(`${this.baseURL}/affiliates/create-user`, payload, {
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
        });
        return r.data;
    }
    static async listAffiliateUsersForPicker(unattachedOnly = false) {
        const tok = localStorage.getItem('token') || localStorage.getItem('affiliateToken');
        const r = await axios.get(`${this.baseURL}/affiliates/users`, {
            params: unattachedOnly ? { unattachedOnly: 'true' } : {},
            headers: { Authorization: 'Bearer ' + tok },
        });
        return r.data;
    }
    static async getMyAffiliateTree() {
        const r = await axios.get(`${this.baseURL}/affiliates/my-tree`, { headers: this._affiliateHeaders() });
        return r.data;
    }
    static async getMyDirectChildren() {
        const r = await axios.get(`${this.baseURL}/affiliates/direct-children`, { headers: this._affiliateHeaders() });
        return r.data;
    }

    // ----- API Access Requests -----
    static async createApiAccessRequest(payload) {
        const r = await axios.post(`${this.baseURL}/api-access-requests`, payload, { headers: this._affiliateHeaders() });
        return r.data;
    }
    static async getMyApiAccessRequests() {
        const r = await axios.get(`${this.baseURL}/api-access-requests/mine`, { headers: this._affiliateHeaders() });
        return r.data;
    }
    static async getAllApiAccessRequests(params = {}) {
        const r = await axios.get(`${this.baseURL}/api-access-requests`, { params, headers: this._adminHeaders() });
        return r.data;
    }
    static async approveApiAccessRequest(id) {
        const r = await axios.post(`${this.baseURL}/api-access-requests/${id}/approve`, {}, { headers: this._adminHeaders() });
        return r.data;
    }
    static async rejectApiAccessRequest(id, reason) {
        const r = await axios.post(`${this.baseURL}/api-access-requests/${id}/reject`, { reason }, { headers: this._adminHeaders() });
        return r.data;
    }

    // ----- Payouts (admin) -----
    static async getPayoutsSummary() {
        const r = await axios.get(`${this.baseURL}/payouts/summary`, { headers: this._adminHeaders() });
        return r.data;
    }
    static async getPayoutsForAffiliate(affiliateId, status = 'unpaid') {
        const r = await axios.get(`${this.baseURL}/payouts/${affiliateId}`, { params: { status }, headers: this._adminHeaders() });
        return r.data;
    }
    static async markPayoutPaid(affiliateId, body) {
        const r = await axios.post(`${this.baseURL}/payouts/${affiliateId}/mark-paid`, body, { headers: this._adminHeaders() });
        return r.data;
    }
    static async getPayoutHistory(affiliateId) {
        const r = await axios.get(`${this.baseURL}/payouts/${affiliateId}/history`, { headers: this._adminHeaders() });
        return r.data;
    }

    // ----- Earnings -----
    static async getMyEarnings() {
        const r = await axios.get(`${this.baseURL}/earnings/mine`, { headers: this._affiliateHeaders() });
        return r.data;
    }
    static async getAdminEarningsReport(params = {}) {
        const r = await axios.get(`${this.baseURL}/earnings/admin/report`, { params, headers: this._adminHeaders() });
        return r.data;
    }

    // ----- Stripe Buy-Now (paid affiliate links) -----
    static async createAffiliateGuideCheckout(payload) {
        const r = await axios.post(`${this.baseURL}/purchase/affiliate-guide`, payload);
        return r.data;
    }
    static async getAffiliateGuideOrder(sessionId) {
        const r = await axios.get(`${this.baseURL}/purchase/affiliate-guide/order/${sessionId}`);
        return r.data;
    }

    // ----- Website Orders (admin) -----
    static async getWebsiteOrders(params = {}) {
        const r = await axios.get(`${this.baseURL}/website/admin/orders`, {
            params,
            headers: this._adminHeaders(),
        });
        return r.data;
    }
    static async resendWebsiteOrderEmail(orderId) {
        const r = await axios.post(
            `${this.baseURL}/website/admin/orders/${orderId}/resend-email`,
            {},
            { headers: this._adminHeaders() }
        );
        return r.data;
    }
    static async reprovisionWebsiteOrderEsims(orderId) {
        const r = await axios.post(
            `${this.baseURL}/website/admin/orders/${orderId}/provision-esims`,
            {},
            { headers: this._adminHeaders() }
        );
        return r.data;
    }

    // ----------------------------------------------------------------------
    // Google Drive
    // ----------------------------------------------------------------------

    /** Links a publicly shared Drive folder. Returns the connection + its storageToken. */
    static async linkGoogleDrive({ folderUrl, displayName, recursive }) {
        const r = await axios.post(
            `${this.baseURL}/google-drive/connections`,
            { folderUrl, displayName, recursive },
            { headers: this._adminHeaders() }
        );
        return r.data;
    }

    static async getDriveConnections(params = {}) {
        const r = await axios.get(`${this.baseURL}/google-drive/connections`, {
            params,
            headers: this._adminHeaders(),
        });
        return r.data;
    }

    static async getDriveConnection(storageToken) {
        const r = await axios.get(`${this.baseURL}/google-drive/connections/${storageToken}`, {
            headers: this._adminHeaders(),
        });
        return r.data;
    }

    /**
     * Lists files. Omit `recursive` and the backend decides: browsing a folder
     * stays in that folder, while a type filter or search spans every level.
     */
    static async getDriveFiles(storageToken, params = {}) {
        const r = await axios.get(`${this.baseURL}/google-drive/connections/${storageToken}/files`, {
            params,
            headers: this._adminHeaders(),
        });
        return r.data;
    }

    static async getDriveFileMetadata(fileToken, params = {}) {
        const r = await axios.get(`${this.baseURL}/google-drive/files/${encodeURIComponent(fileToken)}`, {
            params,
            headers: this._adminHeaders(),
        });
        return r.data;
    }

    /**
     * Downloads a file by token or by exact name.
     *
     * Returns the raw blob plus the filename the SERVER sent in
     * Content-Disposition, so the original Drive name is preserved. The backend
     * exposes that header via Access-Control-Expose-Headers - without it the
     * browser cannot read it cross-origin and every file saves as "download".
     */
    static async downloadDriveFile(storageToken, { fileToken, name, folder }) {
        const r = await axios.get(`${this.baseURL}/google-drive/connections/${storageToken}/download`, {
            params: { fileToken, name, folder },
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
            responseType: 'blob',
        });

        let filename = name || 'download';
        const disposition = r.headers['content-disposition'] || '';
        const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
        const plain = /filename="([^"]+)"/i.exec(disposition);
        if (utf8) filename = decodeURIComponent(utf8[1]);
        else if (plain) filename = plain[1];

        return { blob: r.data, filename };
    }

    /** Rebuilds the search index and revalidates the folder. Also reconnects. */
    static async syncDriveConnection(storageToken) {
        const r = await axios.post(
            `${this.baseURL}/google-drive/connections/${storageToken}/sync`,
            {},
            { headers: this._adminHeaders() }
        );
        return r.data;
    }

    /** Soft disconnect - nothing is deleted in Google Drive or the database. */
    static async disconnectDriveConnection(storageToken) {
        const r = await axios.post(
            `${this.baseURL}/google-drive/connections/${storageToken}/disconnect`,
            {},
            { headers: this._adminHeaders() }
        );
        return r.data;
    }

    // ----------------------------------------------------------------------
    // Google Drive - /api/drive/*
    //
    // These endpoints do NOT accept the admin JWT. They authenticate with a
    // Drive API bearer token (ygdrv_...) minted by the admin router, so the
    // panel provisions one on first use and caches it in localStorage. A
    // rejected token is re-minted once and the request retried, which covers
    // the token being revoked, expired, or wiped from the database.
    // ----------------------------------------------------------------------

    static DRIVE_TOKEN_KEY = 'driveApiToken';

    static async _mintDriveToken() {
        const r = await axios.post(
            `${this.baseURL}/drive/admin/tokens`,
            // can_delete is off by default on the API. The panel is the admin
            // surface, so its own token carries it - and a token minted before
            // the delete feature existed is re-minted on the first 403, see
            // _drive() below.
            { name: 'Admin Panel', can_delete: true },
            { headers: this._adminHeaders() }
        );
        const token = r.data?.data?.token;
        if (!token) throw new Error('Drive API token was not returned');
        localStorage.setItem(this.DRIVE_TOKEN_KEY, token);
        return token;
    }

    static async _driveToken(forceNew = false) {
        if (!forceNew) {
            const cached = localStorage.getItem(this.DRIVE_TOKEN_KEY);
            if (cached) return cached;
        }
        return this._mintDriveToken();
    }

    /**
     * Runs a Drive request with a token, re-minting once if the server rejects
     * it. `request` receives the headers to use and returns the axios promise.
     */
    static async _drive(request, { retried = false } = {}) {
        const token = await this._driveToken(retried);
        try {
            return await request({ Authorization: 'Bearer ' + token });
        } catch (error) {
            const status = error?.response?.status;
            const code = error?.response?.data?.code || '';
            const rejected = status === 401 && code.startsWith('TOKEN_');
            // A cached token minted before a permission existed lacks it. Re-mint
            // once rather than making the user clear localStorage to get a
            // feature that is supposed to just work.
            const underprivileged = status === 403 && code === 'DELETE_FORBIDDEN';
            if ((rejected || underprivileged) && !retried) {
                return this._drive(request, { retried: true });
            }
            throw error;
        }
    }

    /**
     * Crawl state per configured root folder. Doubles as the folder list - the
     * roots are configured server-side, so this is where the UI learns what
     * exists rather than from a per-user connections table.
     */
    static async getDriveRoots() {
        return this._drive(async (headers) => {
            const r = await axios.get(`${this.baseURL}/drive/sync/status`, { headers });
            return r.data;
        });
    }

    /**
     * Paginated, filterable listing straight from the index.
     * @param {object} params root_folder_id, folder_id, in_folder, type, q,
     *        search_in, extension, include_folders, sort, order, page, limit
     */
    static async getDriveFilesV2(params = {}) {
        return this._drive(async (headers) => {
            const r = await axios.get(`${this.baseURL}/drive/files`, { params, headers });
            return r.data;
        });
    }

    /** Counts and total bytes per type. Same filters as the listing. */
    static async getDriveStats(params = {}) {
        return this._drive(async (headers) => {
            const r = await axios.get(`${this.baseURL}/drive/stats`, { params, headers });
            return r.data;
        });
    }

    /** One file's metadata plus its breadcrumb. */
    static async getDriveFileV2(fileId) {
        return this._drive(async (headers) => {
            const r = await axios.get(
                `${this.baseURL}/drive/files/${encodeURIComponent(fileId)}`,
                { headers }
            );
            return r.data;
        });
    }

    /**
     * Mints a short-lived signed download URL.
     *
     * The URL carries its own credential, so it is opened directly rather than
     * fetched with an Authorization header - which also lets the browser stream
     * a large file to disk instead of buffering it in memory as a blob.
     */
    static async createDriveDownloadLink(fileId) {
        return this._drive(async (headers) => {
            const r = await axios.post(
                `${this.baseURL}/drive/files/${encodeURIComponent(fileId)}/download-link`,
                {},
                { headers }
            );
            return r.data;
        });
    }

    /**
     * Moves a file to the Google Drive trash - the real Drive, not just the
     * index. The owner can restore it from their own Trash for 30 days; after
     * that Google purges it and nothing here can bring it back.
     *
     * @param {boolean} recursive required for folders, since deleting one takes
     *        everything inside it.
     */
    static async deleteDriveFile(fileId, { recursive = false } = {}) {
        return this._drive(async (headers) => {
            const r = await axios.delete(
                `${this.baseURL}/drive/files/${encodeURIComponent(fileId)}`,
                { params: recursive ? { recursive: 'true' } : {}, headers }
            );
            return r.data;
        });
    }

    /** Starts a crawl. Returns 202 immediately - a large tree takes minutes. */
    static async triggerDriveSync(body = {}) {
        const r = await axios.post(`${this.baseURL}/drive/admin/sync`, body, {
            headers: this._adminHeaders(),
        });
        return r.data;
    }

    // --- Root folder registry (admin JWT, not the Drive token) -------------
    // Which folders get indexed. Stored server-side in MongoDB rather than in
    // an environment variable, so this list is editable from the panel.

    /**
     * Which credential the server holds, and the address a private folder has to
     * be shared with. Needed before the UI can sensibly ask for a folder link.
     */
    static async getDriveAccessInfo() {
        const r = await axios.get(`${this.baseURL}/drive/admin/access-info`, {
            headers: this._adminHeaders(),
        });
        return r.data;
    }

    /**
     * Asks Drive whether the server can actually read a folder, before adding it.
     * Always resolves - "not reachable" is an answer, not an error.
     */
    static async checkDriveFolder(folderUrl) {
        const r = await axios.post(
            `${this.baseURL}/drive/admin/check-folder`,
            { folder_url: folderUrl },
            { headers: this._adminHeaders() }
        );
        return r.data;
    }

    static async getDriveRootFolders() {
        const r = await axios.get(`${this.baseURL}/drive/admin/root-folders`, {
            headers: this._adminHeaders(),
        });
        return r.data;
    }

    /** Registers a folder and starts indexing it. Accepts a share URL or an id. */
    static async addDriveRootFolder({ folderUrl, name, accessMode }) {
        const r = await axios.post(
            `${this.baseURL}/drive/admin/root-folders`,
            {
                folder_url: folderUrl,
                name: name || undefined,
                access_mode: accessMode || undefined,
            },
            { headers: this._adminHeaders() }
        );
        return r.data;
    }

    /**
     * The shareable API token for each folder - the thing an admin copies and
     * sends to a client. Values come back in full, and a folder that has never
     * had one gets it minted on this call.
     */
    static async getDriveShareTokens() {
        const r = await axios.get(`${this.baseURL}/drive/admin/share-tokens`, {
            headers: this._adminHeaders(),
        });
        return r.data;
    }

    /** Revokes the folder's current token and issues a new one. */
    static async rotateDriveShareToken(folderId) {
        const r = await axios.post(
            `${this.baseURL}/drive/admin/share-tokens/${encodeURIComponent(folderId)}/rotate`,
            {},
            { headers: this._adminHeaders() }
        );
        return r.data;
    }

    /**
     * @param {boolean} purge also deletes the folder's indexed rows. Without it
     *        the folder is only deactivated and its files stay searchable.
     */
    static async removeDriveRootFolder(folderId, { purge = false } = {}) {
        const r = await axios.delete(
            `${this.baseURL}/drive/admin/root-folders/${encodeURIComponent(folderId)}`,
            { params: purge ? { purge: 'true' } : {}, headers: this._adminHeaders() }
        );
        return r.data;
    }
}

export default ApiService;
