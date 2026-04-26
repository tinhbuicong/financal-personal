import axios, { 
    type AxiosInstance, 
    type AxiosResponse,
    type InternalAxiosRequestConfig, 
} from 'axios';

// 1. Khởi tạo instance với Type
const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/',
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
            const data = error.response.data;
            console.error(`[API Error] Status: ${status}`, data);
            
            if (status === 401) {
                // Xử lý khi hết hạn token
                console.warn("Unauthorized! Redirecting to login...");
            }
        } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            console.error("[API Error] No response received from server:", error.request);
        } else {
            // Lỗi khi thiết lập request
            console.error("[API Error] Message:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;