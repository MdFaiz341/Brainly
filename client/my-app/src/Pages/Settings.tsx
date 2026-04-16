import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Trash2, Lock } from "lucide-react";
import { useAuthStore } from "../storage/AuthStore";
import { DeleteAccount } from "../components/DeleteAccount";
import { useNavigate } from "react-router-dom";
import { useHook } from "../hook/UseHook";


export function Settings() {
    const navigate = useNavigate();
    const {user} = useAuthStore();
    const [hover, setHover] = useState(false);
    const { open, setOpen } = useHook();



  return (
    <>
        <DeleteAccount open={open} setOpen={setOpen}/>
        <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
                <button 
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl transition">
                    <Save size={18} /> Save
                </button>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-6 mb-8">
                <div
                    className="relative"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <img 
                        onClick={()=>setHover(v=>!v)}
                        src={user?.avatar}
                        className="w-28 h-28 object-cover cursor-pointer rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl text-white font-semibold shadow-lg">
                    </img>

                    {/* Hover Menu */}
                    {hover && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-0 left-28 bg-white text-black rounded-xl shadow-xl p-3 w-40"
                    >
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                            View Image
                        </button>

                        <button 
                            className=" w-full text-left px-2 py-1 hover:bg-gray-100 rounded flex items-center gap-2">
                            <Camera size={16} /> Update
                        </button>
                    </motion.div>
                    )}
                </div>

            <div>
                <h2 className="text-xl text-white font-semibold">{user?.firstname} {user?.lastname}</h2>
                <p className="text-gray-300 text-sm">Update your profile details</p>
            </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" defaultValue={user?.firstname} disabled={false} />
            <Input label="Last Name" defaultValue={user?.lastname} disabled={false}/>
            <Input label="Email" defaultValue={user?.email} disabled={true}/>

            <div className="flex flex-col gap-2">
                <label className="text-gray-300">Password</label>
                <button 
                    onClick={()=>navigate("/dashboard/settings/change-password")}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition">
                        <Lock size={16} /> Change Password
                </button>
            </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-10 border-t border-white/20 pt-6">
            <h3 className="text-red-400 font-semibold mb-3">Danger Zone</h3>
            <button 
                onClick={()=>setOpen(true)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition">
                <Trash2 size={16} /> Delete Account
            </button>
            </div>
        </motion.div>
        </div>
    </>
  );
}

function Input({ label, defaultValue, disabled }:{
    label:string,
    defaultValue?:string,
    disabled:boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-300">{label}</label>
      <input
        defaultValue={defaultValue}
        disabled={disabled}
        className={`${disabled && "cursor-not-allowed"} bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
      />
    </div>
  );
}
