"use client"

import React, { useState } from "react"

export default function RegisterCom({setLogin}: {setLogin: (Value: boolean) => void}){
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [loginState, setLoginState] = useState('')
    const backend = process.env.NEXT_PUBLIC_BACKEND
    async function handleSubmit(e:React.SubmitEvent){
        e.preventDefault()
        if(!name.trim() || !username.trim()){
            return setLoginState('enter all the credentials.')
        }
        else if(password.length < 6){
            return setLoginState('password must contain at least 6 characters.')
        }
        else if(password != rePassword){
            return setLoginState('password and repeated password are not the same.')
        }
        setLoginState('trying to register...')
        const res = await fetch(backend+"/auth/register", {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username, password, name})
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
    }
    return(
        <form onSubmit={handleSubmit}>
            <div className="top">
                <h2>Register</h2><h3 onClick={() => {
                    setLogin(true)
                }}>Login</h3>
            </div>
            <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value)
                }}
            />
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
            <input
                type="password"
                placeholder="repeat the password"
                value={rePassword}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                    setRePassword(e.target.value)
                }}
            />
            <button>Register</button>
            {loginState!=''&&<div className="login-state">{loginState}</div>}
        </form>
    )
}