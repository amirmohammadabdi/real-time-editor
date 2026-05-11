"use client"

import { FileInterface, Folder } from "@/app/lib/interface";
import { ReactNode, useEffect, useState } from "react";

function FileTree({
  socket,
  setFiles,
  setFolders,
  data,
  folders,
  files,
  selectedFolder,
  setSelectedFolder,
  selectedFile,
  setSelectedFile,
  marginLeft = 0
}: {
  socket: any,
  data: any,
  folders: Folder[],
  files: FileInterface[],
  selectedFolder: string,
  setSelectedFolder: (value: string) => void,
  setSelectedFile: (value: string) => void,
  selectedFile: string,
  marginLeft: number,
  setFiles: React.Dispatch<React.SetStateAction<FileInterface[]>>,
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
}): ReactNode {
    // console.log(Object.keys(data))
    function deleteFile(id: string) {
        setFiles(prev => prev.filter(f => f._id !== id))
        if(selectedFile==id){
            setSelectedFile('')
        }
        socket.current.emit('del-file', id)
    }

    function deleteFolder(id: string) {
        setFolders(prev => prev.filter(f => f._id !== id))
        setFiles(prev => prev.filter(f => f.folder !== id))
        socket.current.emit('del-folder', id)
        setSelectedFolder('0')
    }
    return (
      <ul>
        {// This is a boolean check
            data['files'].map((file:string, index:number) => {
                let fileName = files.filter(f => f._id == file)
                return( // This returns an array of React elements
                    <li key={index} style={{color: selectedFile==file?'blue':'black',marginLeft}} onClick={() => {
                        setSelectedFile(file)
                        socket.current.emit("select-file", file)
                    }}>{fileName[0].name}
                        <button onClick={()=>{
                            deleteFile(file)
                        }}>delete</button>
                    </li>
                )
            })
        }
        {
            Object.keys(data).map(k => {
                if(k != 'files'){
                    let foldername = folders.filter(f => f._id == k)
                    return(
                        <li key={k} style={{marginLeft}}>
                            <strong style={{color: selectedFolder==k?'red':'black'}} onClick={()=>{
                                setSelectedFolder(k)
                            }}>{foldername[0].name}
                                <button onClick={() => {
                                    deleteFolder(k)
                                }}>delete</button>
                            </strong>
                            <FileTree socket={socket} setFiles={setFiles} setFolders={setFolders} data={data[k]} files={files} folders={folders} setSelectedFolder={setSelectedFolder} selectedFolder={selectedFolder} selectedFile={selectedFile} setSelectedFile={setSelectedFile} marginLeft={marginLeft+20}/>
                        </li>
                    )
                }
            })
        }
      </ul>
    );
}


export default function DirCom({setSelectedFile, selectedFile, socket}: {setSelectedFile: (value: string)=>void, selectedFile:string, socket:any}){

    const [newFolder, setNewFolder] = useState('')
    const [newFile, setNewFile] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('0')


    const [folders, setFolders] = useState<Folder[]>([{name: 'src', _id: '0', folder: '-1'}]);
    const [files, setFiles] = useState<FileInterface[]>([]);


    useEffect(() => {
        if(socket.current){
            socket.current.on('new-folder', (data: Folder) => {
                setFolders(prev => [...prev, data])
            })

            socket.current.on('new-file', (data: FileInterface) => {
                setFiles(prev => [...prev, data])
            })

            socket.current.on('del-file', (data: string) => {
                setFiles(prev => prev.filter(f => f._id !== data))
            })

            socket.current.on('del-folder', (data: string) => {
                setFolders(prev => prev.filter(f => f._id !== data))
                setFiles(prev => prev.filter(f => f.folder !== data))
                setSelectedFolder('0')
            })
            socket.current.on('history', (data: {files: FileInterface[], folders: Folder[], selected: string}) => {
                setFiles(data.files)
                setFolders(data.folders)
                setSelectedFile(data.selected)
                socket.current.emit('got-history')
            })
            socket.current.emit('ready-for-history')
        }
        return () => {
            if(socket.current){
                socket.current.off('new-folder')
                socket.current.off('new-file')
                socket.current.off('history')
                socket.current.off('del-file')
                socket.current.off('del-folder')
            }
        }
    }, [socket.current])

    function sort(f_id:string){
        let tmp:any = { files: [] }
        folders.forEach(f => {
            if(f.folder == f_id){
                tmp[f._id] = sort(f._id)
            }
        })
        files.forEach(f => {
            if(f.folder == f_id){
                tmp.files.push(f._id)
            }
        })
        return tmp
    }
    // console.log(sort())

    function handleAddFolder(e:React.SubmitEvent){
        e.preventDefault()
        let id = Date.now().toString()
        socket.current.emit('new-folder', {name: newFolder, folder: selectedFolder, _id: id})
        setFolders([...folders, {name: newFolder, folder: selectedFolder, _id: id}])
        setNewFolder('')
        setSelectedFolder(id)
    }
    function handleAddFile(e:React.SubmitEvent){
        e.preventDefault()
        let id = Date.now().toString()
        socket.current.emit('new-file', {name: newFile, folder: selectedFolder, _id: id, body:''})
        setFiles([...files, {name: newFile, folder: selectedFolder, _id: id, body: ''}])
        setNewFile('')
    }

    return(
        <div className="dir-container">
            <div className="options">
                <form onSubmit={handleAddFolder}>
                    <input
                        type="text" 
                        placeholder="folder name"
                        value={newFolder}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                            setNewFolder(e.target.value)
                        }}
                    />
                    <button>create</button>
                </form>
                <form onSubmit={handleAddFile}>
                    <input
                        type="text" 
                        placeholder="file name"
                        value={newFile}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                            setNewFile(e.target.value)
                        }}
                    />
                    <button>create</button>
                </form>
            </div>
            <ul className="folder-files">
                <strong style={{color: selectedFolder=="0"?'red':'black'}} onClick={() => {
                    setSelectedFolder('0')
                }}>src</strong>
                <FileTree socket={socket} setFiles={setFiles} setFolders={setFolders} data={sort("0")} files={files} folders={folders} setSelectedFolder={setSelectedFolder} selectedFolder={selectedFolder} selectedFile={selectedFile} setSelectedFile={setSelectedFile} marginLeft={10} />
            </ul>
        </div>
    )
}