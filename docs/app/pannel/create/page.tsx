"use client"
import PannelUl from "@/app/components/pannel/pannelUl";
import { Member, Role } from "@/app/lib/interface";
import React, { useState } from "react";

export default function Create(){
    const [name, setName] = useState('')
    const [members, setMembers] = useState<Member[]>([])
    const backend = process.env.NEXT_PUBLIC_BACKEND

    function addMem(){
        setMembers([...members, {username: '', password:'', name: '', _id: Date.now().toString(), role: Role.member}])
    }
    function deleteMem(id:string){
        setMembers(members.filter(mem => mem._id != id))
    }
    function changeUsername(value:string, id:string){
        let newMems:Member[] = []
        members.forEach(mem => {
            if(mem._id == id){
                newMems.push({...mem, username: value})
            }
            else{
                newMems.push(mem)
            }
        })
        setMembers(newMems)
    }
    function changePassword(value:string, id:string){
        let newMems:Member[] = []
        members.forEach(mem => {
            if(mem._id == id){
                newMems.push({...mem, password: value})
            }
            else{
                newMems.push(mem)
            }
        })
        setMembers(newMems)
    }
    function changeName(value:string, id:string){
        let newMems:Member[] = []
        members.forEach(mem => {
            if(mem._id == id){
                newMems.push({...mem, name: value})
            }
            else{
                newMems.push(mem)
            }
        })
        setMembers(newMems)
    }
    function changeRole(value:string, id:string){
        let newMems:Member[] = []
        members.forEach(mem => {
            if(mem._id == id){
                newMems.push({...mem, role: value as Role})
            }
            else{
                newMems.push(mem)
            }
        })
        setMembers(newMems)
    }
    async function handleSubmit(e:React.SubmitEvent){
        e.preventDefault()
        const res = await fetch(backend+'/user/room', {
            method: 'POST',
            headers: {
                Authorization: localStorage.getItem('token')||'',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, members})
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
        setName('')
        setMembers([])
    }
    return(
        <main className="pannel">
            <form onSubmit={handleSubmit}>
                <h2>Create</h2>
                <input
                    type="text"
                    placeholder="room name"
                    value={name}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value)
                    }}
                    required
                />
                <div className="mem-container">
                    <div className="top">
                        <h3>members</h3>
                        <button type="button" onClick={addMem}>add member</button>
                    </div>
                    <div className="mems-box row">
                        {
                            members.map((mem, index) => {
                                return(
                                    <div className="mem-card col-12 col-sm-6" key={index}>
                                        <input
                                            type="text" 
                                            placeholder="name"
                                            value={mem.name}
                                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                                changeName(e.target.value, mem._id)
                                            }}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="username"
                                            value={mem.username}
                                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                                changeUsername(e.target.value, mem._id)
                                            }}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="password"
                                            value={mem.password}
                                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                                changePassword(e.target.value, mem._id)
                                            }}
                                            required
                                        />
                                        <select value={mem.role} onChange={(e:React.ChangeEvent<HTMLSelectElement>) => {
                                            changeRole(e.target.value, mem._id)
                                        }}>
                                            <option value={Role.admin}>admin</option>
                                            <option value={Role.member}>member</option>
                                        </select>
                                        <button type="button" onClick={() => {
                                            deleteMem(mem._id)
                                        }}>delete member</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <button>submit</button>
            </form>
            <PannelUl/>
        </main>
    )
}