"use client"
import { createContext, ReactNode, useEffect, useState } from "react";
import { Payload } from "../lib/interface";

interface ContextInterface{
    userState: Payload|null,
    setUserState: (value: Payload|null) => void
}

export const userContext = createContext({} as ContextInterface)

export function ContextProvider({children}: {children: ReactNode}){
    const [userState, setUserState] = useState<Payload|null>(null)
    const backend = process.env.NEXT_PUBLIC_BACKEND
    useEffect(() => {
        async function fetchData(){
            console.log(backend+'/userState')
            const res = await fetch(backend+"/userState", {
                method: 'GET',
                headers: {Authorization: localStorage.getItem('token')||''}
            })
            if(!res.ok){
                try{
                    const data = await res.json()
                    console.log(data.message)
                }
                catch(err:any){
                    console.log(err.message)
                }
                return setUserState(null)
            }
            const data = await res.json()
            setUserState(data.user)
        }
        fetchData()
    }, [])
    return(
        <userContext.Provider value={{userState, setUserState}}>
            {children}
        </userContext.Provider>
    )
}