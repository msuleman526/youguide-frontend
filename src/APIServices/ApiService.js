import axios from 'axios';

class ApiService {
    //static URLL = "https://appapi.youguide.com"
    //static baseURL = ApiService.URLL + '/api'; // Set your base URL here
    documentURL = "https://appapi.youguide.com" + '/';
    
    static URLL = "http://localhost:5001"
    static baseURL = ApiService.URLL + '/api'; // Set your base URL here
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
}

export default ApiService;
