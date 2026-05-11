"use client"

import { useEffect, useState } from "react"
import { Room } from "../lib/interface"
import DeleteRoom from "../components/pannel/deleteRoom"
import PannelUl from "../components/pannel/pannelUl"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Pannel(){
    const [rooms, setRooms] = useState<Room[]>([])
    const [deleteRoom, setDeleteRoom] = useState('')
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const router = useRouter()
    useEffect(() => {
        async function fetchData(){
            const res = await fetch(backend+'/user/rooms', {
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
                return
            }
            const data = await res.json()
            console.log(data.message)
            setRooms(data.rooms)
        }
        fetchData()
    }, [])
    return(
        <main className="pannel">
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rooms.map(room => (
                            <tr key={room._id}>
                                <th>
                                    {room.name}
                                    <div><Link href={`/pannel/room/${room._id}`}>Room Link</Link></div>
                                </th>
                                <th>
                                    <button style={{marginRight: 5}} onClick={() => {
                                        setDeleteRoom(room._id)
                                    }}>delete</button>
                                    <button onClick={() => {
                                        router.push('/pannel/edit/'+room._id)
                                    }}>edit</button>
                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {deleteRoom!='' && <DeleteRoom deleteRoom={deleteRoom} setDeleteRoom={setDeleteRoom} rooms={rooms} setRooms={setRooms} />}
            <PannelUl/>
        </main>
    )
}