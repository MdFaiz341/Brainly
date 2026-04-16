import { type JSX } from "react"
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../storage/AuthStore";






export const ProtectedRoute = ({children}:{children:JSX.Element})=>{

    const token = useAuthStore((state)=>state.token);
    if(!token){ 
        return <Navigate to={"/signin"}/>
    }
    else{
        return children;
    }

}