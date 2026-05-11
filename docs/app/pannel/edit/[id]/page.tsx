"use client"
import PannelUl from "@/app/components/pannel/pannelUl";
import { Member, Role } from "@/app/lib/interface";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Create(){
    const [name, setName] = useState('')
    const [members, setMembers] = useState<Member[]>([])
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const [newMembers, setNewMembers] = useState<Member[]>([])
    const [rmMems, setRmMems] = useState<string[]>([])
    const [changedMems, setChangedMems] = useState<Member[]>([])
    const {id} = useParams()

    function addMem(){
        const id = Date.now().toString()
        setNewMembers([...newMembers, {username: '', password:'', name: '', _id: id, role: Role.member}])
        setMembers([...members, {username: '', password:'', name: '', _id: id, role: Role.member}])
    }
    function deleteMem(id:string){
        setMembers(members.filter(mem => mem._id != id))
        let isNew = false;
        let newOnes:Member[] = []
        newMembers.forEach(nm => {
            if(nm._id == id){
                isNew = true
            }
            else{
                newOnes.push(nm)
            }
        })
        setNewMembers(newOnes)
        if(!isNew){
            setRmMems([...rmMems, id])
        }
    }
    function changeUsername(value:string, id:string){
        let newMems:Member[] = []
        let oldOne:Member|undefined
        members.forEach(mem => {
            if(mem._id == id){
                newMems.push({...mem, username: value})
                oldOne = {...mem, username: value}
            }
            else{
                newMems.push(mem)
            }
        })
        setMembers(newMems)

        let isNew = false;
        let newOnes:Member[] = []
        newMembers.forEach(nm => {
            if(nm._id == id){
                isNew = true
                newOnes.push({...nm, username: value})
            }
            else{
                newOnes.push(nm)
            }
        })
        setNewMembers(newOnes)
        if(!isNew){
            let isChangedBefore = false
            let newChanged:Member[] = []
            changedMems.forEach(cm => {
                if(cm._id == id){
                    isChangedBefore = true
                    newChanged.push({...cm, username: value})
                }
                else{
                    newChanged.push(cm)
                }
            })
            if(!isChangedBefore){
                newChanged.push(oldOne!)
            }
            setChangedMems(newChanged)
        }
    }

    function changePassword(value:string, id:string){
        let newMems:Member[] = []
        let oldOne:Member|undefined
        members.forEach(mem => {
            if(mem._id == id){
                newMems.push({...mem, password: value})
                oldOne = {...mem, password: value}
            }
            else{
                newMems.push(mem)
            }
        })
        setMembers(newMems)
        let isNew = false;
        let newOnes:Member[] = []
        newMembers.forEach(nm => {
            if(nm._id == id){
                isNew = true
                newOnes.push({...nm, password: value})
            }
            else{
                newOnes.push(nm)
            }
        })
        setNewMembers(newOnes)
        if(!isNew){
            let isChangedBefore = false
            let newChanged:Member[] = []
            changedMems.forEach(cm => {
                if(cm._id == id){
                    isChangedBefore = true
                    newChanged.push({...cm, password: value})
                }
                else{
                    newChanged.push(cm)
                }
            })
            if(!isChangedBefore){
                newChanged.push(oldOne!)
            }
            setChangedMems(newChanged)
        }
    }

    function changeName(value:string, id:string){
        let newMems:Member[] = []
        let oldOne:Member|undefined
        members.forEach(mem => {
            if(mem._id == id){
                newMems.push({...mem, name: value})
                oldOne = {...mem, name: value}
            }
            else{
                newMems.push(mem)
            }
        })
        setMembers(newMems)
        let isNew = false;
        let newOnes:Member[] = []
        newMembers.forEach(nm => {
            if(nm._id == id){
                isNew = true
                newOnes.push({...nm, name: value})
            }
            else{
                newOnes.push(nm)
            }
        })
        setNewMembers(newOnes)
        if(!isNew){
            let isChangedBefore = false
            let newChanged:Member[] = []
            changedMems.forEach(cm => {
                if(cm._id == id){
                    isChangedBefore = true
                    newChanged.push({...cm, name: value})
                }
                else{
                    newChanged.push(cm)
                }
            })
            if(!isChangedBefore){
                newChanged.push(oldOne!)
            }
            setChangedMems(newChanged)
        }
    }
    function changeRole(value:string, id:string){
        let newMems:Member[] = []
        let oldOne:Member|undefined
        members.forEach(mem => {
            if(mem._id == id){
                newMems.push({...mem, role: value as Role})
                oldOne = {...mem, role: value as Role}
            }
            else{
                newMems.push(mem)
            }
        })
        setMembers(newMems)
        let isNew = false;
        let newOnes:Member[] = []
        newMembers.forEach(nm => {
            if(nm._id == id){
                isNew = true
                newOnes.push({...nm, role: value as Role})
            }
            else{
                newOnes.push(nm)
            }
        })
        setNewMembers(newOnes)
        if(!isNew){
            let isChangedBefore = false
            let newChanged:Member[] = []
            changedMems.forEach(cm => {
                if(cm._id == id){
                    isChangedBefore = true
                    newChanged.push({...cm, role: value as Role})
                }
                else{
                    newChanged.push(cm)
                }
            })
            if(!isChangedBefore){
                newChanged.push(oldOne!)
            }
            setChangedMems(newChanged)
        }
    }

    async function fetchData(){
        const res = await fetch(backend+"/user/room/"+id, {
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
        setName(data.room.name)
        let mems:Member[] = [] 
        data.members.forEach((e:Member) => {
            mems.push({...e, password: '', old: true})
        })
        setMembers(mems)
    }
    async function handleSubmit(e:React.SubmitEvent){
        e.preventDefault()
        const res = await fetch(backend+'/user/room/'+id, {
            method: 'PUT',
            headers: {
                Authorization: localStorage.getItem('token')||'',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, newMems: newMembers, rmMems, changedMems})
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
        let newOldMembers:Member[] = []
        members.forEach(m => {
            newOldMembers.push({...m, old: true})
        })
        setMembers(newOldMembers)
        setRmMems([])
        setChangedMems([])
        setNewMembers([])
    }
    useEffect(() => {
        fetchData()
    }, [])
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
                                        { mem.old && <div className="bef-password">enter new password for the user</div> }
                                        <input
                                            type="text"
                                            placeholder="password"
                                            value={mem.password}
                                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                                changePassword(e.target.value, mem._id)
                                            }}
                                            required={mem.old?false:true}
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