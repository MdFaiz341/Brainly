
import { IoMdAddCircleOutline } from "react-icons/io";
import { SidebarButton } from "../storage/SidebarButton.";
import { useNavigate } from "react-router-dom";
import image from "../assets/brain-generator-idea-svgrepo-com.svg";




export const Sidebar = ({setModalOpen, contentHook}:{
    setModalOpen:(e:boolean)=>void,
    contentHook:any,
})=>{

    const navigate = useNavigate();
    

    function clickHandler(name:string){
        if(name === "Settings"){
            navigate("/dashboard/settings");
        }
        else{
            const value = name === "All" ? "" : name.toLowerCase();
            contentHook.setType(value);
        }
    }


    return(
        <div className="w-full h-full p-4">
            <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-2 items-center border-b pb-4 mb-5 border-blue-700">
                    <img src={image} width={30} height={30} className=""></img>
                    <div className={`font-bold text-2xl dark:text-white text-black`}>Brain</div>
                </div>
                {
                     SidebarButton.map((items, index)=>(
                        <div 
                            onClick={()=>clickHandler(items.name)}
                            key={index} 
                            className="flex font-semibold text-lg dark:text-white items-center gap-2 cursor-pointer p-2 dark:hover:bg-gray-600 hover:bg-gray-300 rounded-xl transition-all duration-300 ease-in-out">
                            {items.icon}
                            {items.name}
                        </div>
                    ))
                }
                <div onClick={()=>setModalOpen(true)} className="flex font-semibold dark:text-white text-lg bg-sky-500 items-center gap-2 cursor-pointer p-2 hover:bg-violet-600 rounded-xl transition-all duration-300 ease-in-out">
                    <IoMdAddCircleOutline/>
                    Create
                </div>
            </div>
        </div>
    )
}