import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};


export const parentAPI = {
    register: async (parentData) => {
        const response = await api.post('/parent/register', parentData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('parent', JSON.stringify(response.data.parent));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/parent/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('parent', JSON.stringify(response.data.parent));
        }
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/parent/profile');
        return response.data;
    },

    getChildren: async () => {
        const response = await api.get('/parent/children');
        return response.data;
    },

    getChildById: async (childId) => {
        const response = await api.get(`/parent/children/${childId}`);
        return response.data;
    },

    updateChild: async (childId, childData) => {
        const response = await api.put(`/parent/children/${childId}`, childData);
        return response.data;
    },

    updateChildProgress: async (childId, progressData) => {
        const response = await api.put(`/parent/children/${childId}/progress`, progressData);
        return response.data;
    },

    recordChildMood: async (childId, moodData) => {
        const response = await api.post(`/parent/children/${childId}/mood`, moodData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('parent');
    },

    getCurrentParent: () => {
        const parentStr = localStorage.getItem('parent');
        return parentStr ? JSON.parse(parentStr) : null;
    },

    isParentAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};


export const testAPI = {
    submitTest: async (testData) => {
        const response = await api.post('/test/submit', testData);
        return response.data;
    },

    getTestStatus: async () => {
        const response = await api.get('/test/status');
        return response.data;
    }
};


export const mlAPI = {
    predictASD: async (features) => {
        console.log('Sending features to ML service:', features);
        try {
            
            const response = await api.post('/prediction/predict', {
                features: features
            });
            console.log('ML service response:', response.data);
            return response.data;
        } catch (error) {
            console.error('ML API Error through server:', error);
            console.error('Error response:', error.response?.data);
            throw new Error('Failed to get ML prediction: ' + error.message);
        }
    }
};

export default api;
