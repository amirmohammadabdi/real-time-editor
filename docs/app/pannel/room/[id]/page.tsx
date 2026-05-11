"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function Room(){
    const {id} = useParams()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginState, setLoginState] = useState('')
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const router = useRouter()

    async function handleSubmit(e:React.SubmitEvent){
        e.preventDefault()
        setLoginState('trying to login...')
        const res = await fetch(backend+"/room/login/"+id, {
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
        localStorage.setItem('IoToken', data.token);
        router.push('/pannel/joinRoom')
    }
    return(
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div className="top">
                    <h2>Join Room</h2>
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
                <button>Join</button>
                {loginState!=''&&<div className="login-state">{loginState}</div>}
            </form>
        </div>
    )
}