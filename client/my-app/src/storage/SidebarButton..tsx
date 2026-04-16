import { FaYoutube } from "react-icons/fa";
import { RiTwitterFill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { Aperture } from "lucide-react"


export const SidebarButton = [
    {
        icon: <Aperture/>,
        name: "All"
    },
    {
        icon: <FaYoutube/>,
        name: "Youtube"
    },
    {
        icon : <RiTwitterFill/>,
        name: "Twitter"
    },
    {
        icon: <IoSettingsSharp/>,
        name: "Settings"
    }
]