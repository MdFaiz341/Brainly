import { Trash2 } from "lucide-react"
import { Button } from "./Button"
import { Input } from "./Input"
import { useRef } from "react"
import { useAuthStore } from "../storage/AuthStore"
import toast from "react-hot-toast"
import api from "../API/interceptor"
import { useHook } from "../hook/UseHook"
import { useNavigate } from "react-router-dom"





export const DeleteAccount = ({open, setOpen}:{
    open:boolean,
    setOpen:(e:boolean)=>void
})=>{

    const inputRef = useRef<HTMLInputElement>(null);
    const {loading, setLoading } = useHook();
    const navigate = useNavigate();


    async function deleteHanler() {
        const email = inputRef.current?.value;
        if(!email){
            alert("Enter correct email");
            return;
        }
        try{
            setLoading(true);
            await new Promise((res)=>setTimeout(res, 3000));
            const response = await api.post("/deleteAccount", {email});
            useAuthStore.getState().logout();
            navigate("/signup");
            toast.success(response.data.message);
        }
        catch(e:any){
            toast.error(e.response.data?.message);
        }finally{
            setLoading(false);
        }
    }


    return(
        <>
            {
                open &&
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 transition-all duration-300">
                    <div className="flex w-[342px] flex-col gap-8 bg-linear-to-br from-gray-400 via-purple-900 to-black rounded-2xl p-5">
                        <h1 className="text-2xl font-bold">Are you Sure ?</h1>
                        <Input 
                            ref={inputRef}
                            type='email'
                            placeholder='Email'
                            id='email'/>
                        <div className="flex gap-10 items-center w-full justify-between">
                            <Button variant="secondary" size="sm" children="Cancle" onClick={()=>setOpen(false)}/>
                            
                            {
                                loading 
                                ? <div className="flex w-full justify-center items-center">
                                    <div className="loader w-10 h-10 bottom-4"></div>
                                </div>
                                :  <button 
                                    onClick={deleteHanler}
                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white px-5 py-2 rounded-xl transition">
                                    <Trash2 size={16} /> Delete Account
                                </button>
                            }
                               
                        </div>
                    </div>
                </div>
            }
        </>
        
    )
}