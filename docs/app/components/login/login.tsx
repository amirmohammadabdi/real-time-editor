"use client"

import { userContext } from "@/app/context/userContext"
import React, { useContext, useState } from "react"

export default function LoginCom({setLogin}: {setLogin: (Value: boolean) => void}){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginState, setLoginState] = useState('')
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const {setUserState} = useContext(userContext)
    async function handleSubmit(e:React.SubmitEvent){
        e.preventDefault()
        setLoginState('trying to login...')
        const res = await fetch(backend+"/auth/login", {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })

        if(!res.ok){
            try{
                const data = await res.json()
                setLoginState(data.message)
            }
            catch(err:any){
                console.log(err.message)
                setLoginState('an error occured.')
            }
            return
        }

        const data = await res.json()
        setLoginState(data.message)
        localStorage.setItem('token', data.token);
        setUserState(data.payload)
    }
    return(
        <form onSubmit={handleSubmit}>
            <div className="top">
                <h2>Login</h2><h3 onClick={() => {
                    setLogin(false)
                }}>Register</h3>
            </div>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value)
                }}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value)
                }}
            />
            <button>Login</button>
            {loginState!=''&&<div className="login-state">{loginState}</div>}
        </form>
    )
}