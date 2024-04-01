import axios, {AxiosResponse, AxiosError} from 'axios';


// Create an Axios instance
const instance = axios.create({
    baseURL: "/api", // Modify baseURL according to your actual situation
    timeout: 5000 // setting timeout
});

// GET request wrapper
export const get = async <T>(url: string, params?: object): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await instance.get(url, {params});
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data);
        } else {
            throw error;
        }
    }
};

// POST request wrapper
export const post = async <T>(url: string, data?: object): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await instance.post(url, data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data);
        } else {
            throw error;
        }
    }
};

// File upload wrapper
export const upload = async <T>(url: string, file: File): Promise<T> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response: AxiosResponse<T> = await instance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data);
        } else {
            throw error;
        }
    }
};
