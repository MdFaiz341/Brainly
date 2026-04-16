import { useAuthStore } from "../storage/AuthStore"
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";



export const ProfileDropDown = ({open, setOpen}:{
    open:boolean,
    setOpen : (e:boolean)=>void
})=>{
    const user = useAuthStore.getState().user;
    const navigate = useNavigate();

    async function logOutHandler(){
        useAuthStore.getState().logout();
        navigate("/signin");
    }


    return (
        <>
            {
                open &&
                <div>
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="absolute right-0 mt-16 w-72 bg-white z-50 dark:bg-gray-900 shadow-2xl rounded-2xl p-4 border dark:border-gray-700"
                        >
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={user?.avatar}
                                    className="w-14 h-14 rounded-full border"
                                />
                                <div>
                                    <h2 className="font-semibold text-gray-800 dark:text-white">
                                    {user?.firstname}
                                    </h2>
                                    <p className="text-sm text-gray-400">{user?.email}</p>
                                </div>
                                <RxCross2 className="absolute right-5 w-5 h-5 cursor-pointer" onClick={()=>setOpen(false)}/>
                            </div>

                            <div className="border-t pt-3 space-y-2">
                            {/* Edit Profile */}
                            <button 
                                onClick={()=>navigate("/dashboard/settings")}
                                className="w-full text-left px-4 py-2 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                ✏️ Edit Profile
                            </button>

                            {/* Logout */}
                            <button onClick={logOutHandler} className="w-full text-left px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition">
                                🚪 Logout
                            </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
      
            }
        </>
    )
}