import { useState } from "react"




export const useHook = ()=>{

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    return{
        loading,
        setLoading,
        open,
        setOpen
    }
}