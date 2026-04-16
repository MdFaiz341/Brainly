import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../storage/AuthStore";
import { Input } from "../components/Input";
import { useHook } from "../hook/UseHook";
import api from "../API/interceptor";



export function ChangePassword() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { loading, setLoading } = useHook();  // changed
  const oldRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const conRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();


  const handleSubmit = async () => {
    try{
        const oldInput = oldRef.current?.value;
        const newInput = newRef.current?.value;
        const conInput = conRef.current?.value;
        if(!oldInput || !newInput || !conInput){
            alert("Fill all details");
            return;
        }
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1500));
        const response = await api.post("/changePassword", {
            oldPassword:oldInput,
            newPassword:newInput,
            confirmPassword:conInput,
        });
        useAuthStore.getState().logout();
        navigate("/signin");
        toast.success(response.data.message);
    }
    catch(e:any){
        toast.error(e.response.data.message || "Password not updated")
    } finally{
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock className="text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Change Password</h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* Old Password */}
          <div className="relative">
            <Input
              type={showOld ? "text" : "password"}
              placeholder="Old Password"
              ref={oldRef}
            />
            <div
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-300"
            >
              {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* New Password */}
          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              ref={newRef}
            />
            <div
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-300"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              ref={conRef}
            />
            <div
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-300"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
        </div>

        {/* Button */}
        <motion.button
          onClick={handleSubmit}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          className="mt-6 w-full py-2 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white font-semibold flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Update Password"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
