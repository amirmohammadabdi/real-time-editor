"use client"

import DirCom from '@/app/components/docsCom/dirCom'
import DocsCom from '@/app/components/docsCom/docsCom'
import { Member } from '@/app/lib/interface'
import { useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'

export default function JoinRoom(){
    
    const socket = useRef<any>(null)
    const [members, setMembers]=useState<Member[]>([])
    const [myInfo, setMyInfo] = useState<Member|null>(null)
    const [selectedFile, setSelectedFile] = useState('')

    useEffect(() => {
        socket.current = io('http://localhost:9000', {
            auth: {
                token: localStorage.getItem('IoToken')||''
            }
        })
        socket.current.on('error', (err:ErrorCallback) => {
            console.log("socket erro:", err)
        })
        socket.current.on('connect_error', (err:ErrorCallback) => {
            console.log("socket erro:", err)
        })
        
        socket.current.on('start', (data:Member) => {
            console.log(data)
            setMyInfo(data)
        })
        socket.current.on('users', (data:Member[]) => {
            console.log(data)
            setMembers(data)
        })
        socket.current.on('select-file', (data:string) => {
            setSelectedFile(data)
            if(data != '')
                socket.current.emit('ready-for-text')
        })
        return () => {
            if(socket.current)
                socket.current.disconnect()
        }
    }, [])
    useEffect(() => {
        if(socket.current){
            socket.current.emit('select-file', selectedFile)
        }
    }, [socket.current, selectedFile])

    return(
        <div className='room-container row'>
            <div className="user-column col-4">
                <div className="in-box">
                    <div className="top">routes</div>
                    <div className='space'>
                        <DirCom selectedFile={selectedFile} setSelectedFile={setSelectedFile} socket={socket}/>
                    </div>
                </div>
                <div className="in-box">
                    <div className="top">members</div>
                    <div className='space'>
                        {
                            members.map(mem => (
                                <div className="item" key={mem._id}>
                                    <div>{mem.name}</div>
                                    <span style={{background: mem.color}}></span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="user-column col-8">
                {selectedFile!='' && <DocsCom myInfo={myInfo} socket={socket} />}
            </div>
        </div>
    )
}