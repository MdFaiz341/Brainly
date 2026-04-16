import { create } from "zustand";
import { persist } from "zustand/middleware";


type User = {
    firstname:string,
    lastname:string,
    avatar:string,
    email:string,
}

type AppState = {
    theme: "dark" | "light",
    setTheme: (val:"dark"| "light")=>void,

    user: User | null,
    token:string | null,
    setAuth:(user:User, token:string)=>void,
    logout:()=>void,
}

export const useAuthStore = create<AppState>()(
    persist(
        (set)=>({
    
            user:null,
            theme:"light",
            token: null,

            setAuth: (user, token)=>{
                set({user, token});
            },
    
            setTheme:(value)=>{
                localStorage.setItem("mode", value);
                set({theme:value})
            },
            
            logout : ()=>{
                set({user:null, token:null});
            }
        }),
        {
            name:"auth-storage",

            partialize:(state) =>({
                user :state.user,
                token:state.token,
            }),
        }
    )

)