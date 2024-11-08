import axios from 'axios';

// Set up Axios to connect to FastAPI backend
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
