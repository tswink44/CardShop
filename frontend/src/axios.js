import axios from 'axios';

/**
 * @constant {AxiosInstance} axiosInstance
 * @description
 * An instance of Axios customized with a base URL for making HTTP requests to a local server and default headers for JSON content type.
 *
 * Configured with:
 * - `baseURL`: The base URL pointing to the local server (http://127.0.0.1:8000).
 * - `headers`: Default headers specifying that the content type for requests is JSON.
 *
 * Commonly used for making HTTP requests such as GET, POST, PUT, PATCH, and DELETE to the specified server with consistent settings.
 */
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
