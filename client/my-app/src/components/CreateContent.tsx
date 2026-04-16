
import { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { useHook } from "../hook/UseHook";
import api from "../API/interceptor";


const ContentType: Record<string, string> = {
    "Youtube": "youtube",
    "Twitter": "twitter",
    "Image" : "image"
}

export const CreateContent = ({modalOpen, setModalOpen}:{
    modalOpen:boolean,
    setModalOpen:(e:boolean)=>void
})=>{

    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const { loading, setLoading } = useHook();

    const [type, setType] = useState(ContentType["Youtube"]);

    async function submitHandler(){
        try{
            const link = linkRef.current?.value;
            const title = titleRef.current?.value;
            if(!link || !title){
                alert("Fill all requirements");
                return;
            }
            setLoading(true);

            await new Promise((res) => setTimeout(res, 3000));

            const resposne = await api.post("/content", {
                link,
                title,
                type,
            });
            toast.success(resposne.data.message);
            setModalOpen(false);
        }
        catch(e:any){
            toast.error(e.resposne?.data.message || "Not able to add content");
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <>
           <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40"
                        
                        // Overlay animation
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >

                        {/* Modal */}
                        <motion.div
                            className="w-[90%] sm:w-[400px] rounded-2xl p-6
                                bg-linear-to-br from-slate-800 via-purple-900 to-slate-900
                                shadow-2xl border border-white/10"

                                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 40 }}
                                transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 15
                            }}
                        >

                            {/* Close */}
                            <div className="flex justify-end">
                                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                                    <RxCross2
                                    onClick={() => setModalOpen(false)}
                                    className="cursor-pointer w-10 h-10"
                                    />
                                </motion.div>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Create Content
                            </h2>

                            {/* Inputs */}
                            <div className="flex flex-col gap-4">
                                <motion.input
                                    ref={titleRef}
                                    whileFocus={{ scale: 1.03 }}
                                    type="text"
                                    placeholder="Title"
                                    className="px-4 py-2 rounded-lg bg-white/10 text-white outline-none focus:ring-2 focus:ring-purple-400"
                                />

                                <motion.input
                                    ref={linkRef}
                                    whileFocus={{ scale: 1.03 }}
                                    type="text"
                                    placeholder="Link"
                                    className="px-4 py-2 rounded-lg bg-white/10 text-white outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>

                            {/* Type */}
                            <div className="mt-4">
                            <p className="text-gray-300 mb-2">Choose Type:</p>
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={()=>setType(ContentType["Youtube"])}
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.1 }}
                                    className={`px-4 cursor-pointer py-1 flex items-center gap-2 rounded-full ${type === "youtube" ? "bg-blue-600" : "bg-sky-500"}`}
                                    >
                                    {type === "youtube" && <Check size={16}/>} Youtube
                                </motion.button>

                                <motion.button
                                    onClick={()=>setType(ContentType["Twitter"])}
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.1 }}
                                    className={`px-4 cursor-pointer py-1 flex items-center gap-2 rounded-full ${type === "twitter" ? "bg-blue-600" : "bg-sky-500"}`}
                                    >
                                    {type === "twitter" && <Check size={16}/>} Twitter
                                </motion.button>
                            </div>
                            </div>

                            {/* Submit */}
                            {
                                loading
                                ? <div className="py-6 w-full flex justify-center items-center">
                                    <div className="loader w-10 h-10"></div>
                                </div>
                                :  <motion.button
                                    onClick={submitHandler}
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.03 }}
                                    className="mt-6 cursor-pointer w-full py-2 rounded-lg bg-linear-to-r from-purple-500 to-blue-500"
                                    >
                                    Submit
                                </motion.button>
                                    
                            }

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}