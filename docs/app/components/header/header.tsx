"use client"

import { userContext } from "@/app/context/userContext";
import Link from "next/link";
import { useContext } from "react";

export default function Header(){
    const {userState} = useContext(userContext)
    return(
        <header>
            <h1>Mocking AI</h1>
            <ul>
                <li><Link href={'/'}>Home</Link></li>
                {!userState && <li><Link href={'/login'}>Login/Register</Link></li>}
                {userState && <li><Link href={'/pannel'}>Pannel</Link></li>}
            </ul>
        </header>
    )
}