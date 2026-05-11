"use client"

import { Room } from "@/app/lib/interface"

interface deleteRoom{
    deleteRoom: string,
    setDeleteRoom: (Value: string) => void,
    setRooms: (value: Room[]) => void,
    rooms: Room[]
}
export default function DeleteRoom({deleteRoom, setDeleteRoom, setRooms, rooms}:deleteRoom){
    const backend = process.env.NEXT_PUBLIC_BACKEND
    async function handleDelete(){
        const res = await fetch(backend+'/user/room/'+deleteRoom, {
                method: 'DELETE',
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
            setDeleteRoom('')
            setRooms(rooms.filter(room => room._id != deleteRoom))
    }
    return(
        <div className="dark-back">
            <div className="delete-box">
                <h3>Are you sure?</h3>
                <div>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={() => {
                        setDeleteRoom('')
                    }}>No</button>
                </div>
            </div>
        </div>
    )
}