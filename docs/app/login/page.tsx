"use client"

import { useState } from "react"
import LoginCom from "../components/login/login"
import RegisterCom from "../components/login/register"

export default function Login(){
    const [login, setLogin] = useState(true)
    return(
        <div className="login-container">
            {login&& <LoginCom setLogin={setLogin} />}
            {!login&& <RegisterCom setLogin={setLogin} />}
        </div>
    )
}