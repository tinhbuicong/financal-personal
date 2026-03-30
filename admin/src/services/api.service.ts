import axios, { 
    type AxiosInstance, 
    type AxiosResponse,
    type InternalAxiosRequestConfig, 
} from 'axios';

// 1. Khởi tạo instance với Type
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Request Interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Trả về data trực tiếp để bên ngoài dùng Type cho gọn
        return response.data;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            // Bạn có thể xử lý logic redirect hoặc thông báo ở đây
            console.error(`[API Error] Status: ${status}`, error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;