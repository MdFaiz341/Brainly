
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Input } from "./Input"
import { Button } from "./Button"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useAuthStore } from "../storage/AuthStore"
import { useNavigate } from "react-router-dom"
import { useHook } from "../hook/UseHook"
import api from "../API/interceptor"


type Formdata = {
    firstname:string,
    lastname:string,
    email:string,
    password:string,
}

// Use a discriminated union for cleaner props
type TemplateProps = {
    mode: "signup" | "login";
    heading: string;
    buttonText: string;
}


export const NewTemplate = ({mode, heading, buttonText}:TemplateProps)=>{

    const isSignUp = mode === "signup";
    const navigate = useNavigate();

    const { loading, setLoading } = useHook();

    const {
        register,
        handleSubmit,
        formState:{errors},
    } = useForm<Formdata>();

    async function submitForm(data:Formdata){
        const endpoint = isSignUp ? "signup" : "login"
        if(endpoint === "signup"){
            try{
                setLoading(true);
                const response = await api.post("/signup", data);
                navigate("/signin");
                toast.success(response.data.message);
            }
            catch(e:any){
                toast.error(e.response.data.message || "Failed to Create Account")
            }finally{
                setLoading(false)
            }
        }
        else{    
            try{
                setLoading(true)
                const response = await api.post("/signin", data)
                const token  = response.data.token;
                const firstname = response.data.firstname;
                const lastname = response.data.lastname;
                const avatar = response.data.avatar;
                const email = response.data.email;
                const user = {
                    firstname,
                    lastname,
                    avatar,
                    email
                }

                useAuthStore.getState().setAuth(user, token);
                navigate("/dashboard");
                toast.success(response.data.message);
            }
            catch(e:any){
                toast.error(e.response.data.message || "Signin Failed")
            }
            finally{
                setLoading(false);
            }  
        }   
        
    }

    return(
        <form onSubmit={handleSubmit(submitForm)} className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black text-white px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-gray-900/60 flex flex-col gap-6 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl shadow-2xl max-w-max"
            >
                <h1 className="text-3xl font-bold text-center mb-5">{heading}</h1>

                {isSignUp && 
                    <div className="flex gap-2 ">
                        <Input
                            type='text'
                            placeholder='Firstname'
                            id='firstname'
                            {...register("firstname",
                                {required: {value: true, message: "Enter First name"}}
                            )}
                            error={errors.firstname?.message}
                        />
                        <Input
                            type='text'
                            placeholder='Lastname'
                            id='lastname'
                            {...register("lastname",
                                {required: {value: true, message: "Enter Last name"}}
                            )}
                            error={errors.lastname?.message}
                        />

                    </div>
                }
                
                {/* --------------emailEmail & password---------- */}
                <Input
                    type='email'
                    placeholder='Email'
                    id='email'
                    {...register("email",
                        {
                            required: {value: true, message: "Enter your email"},
                            pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                        }
                    )}
                    error={errors.email?.message}
                />

                <Input
                    type='password'
                    placeholder='Password'
                    id='password'
                    {...register("password",
                        {
                            required: {value: true, message: "Enter Password"},
                        }
                    )}
                    error={errors.password?.message}
                />

                {loading ? 
                    (   
                        <div className=" w-full flex justify-center items-center py-3">
                            <div className="loader w-10 h-10"></div>
                        </div>
                    ) : (
                        <Button type="submit" variant="primary" size="lg" className="w-full bg-linear-to-r from-purple-500 via-indigo-600 to-pink-500">
                            {buttonText}
                        </Button>
                )}

                {/* Toggle Link */}
                <div className="text-gray-400 text-center text-sm mt-2">
                    {isSignUp ? (
                        <>Already have an account? <Link to={"/signin"} className="text-indigo-500 font-semibold hover:underline">Login</Link></>
                    ) : (
                        <>Don't have an account? <Link to={"/signup"} className="text-indigo-500 font-semibold hover:underline">Sign Up</Link></>
                    )}
                </div>

            </motion.div>
            
        </form>
    )
}