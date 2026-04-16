import axios from "axios";
import { useAuthStore } from "../storage/AuthStore";



const api = axios.create({
    baseURL:import.meta.env.VITE_HTTP_URL,
})

// attach token
api.interceptors.request.use((config)=>{
    const token = useAuthStore.getState().token;

    if(token){
        config.headers.token = token;
    }
    return config;
})

// catch 401;
api.interceptors.response.use(
    (res)=>res,
    (error)=>{
        if(error.response?.status === 401){
            useAuthStore.getState().logout();
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
)


export default api;