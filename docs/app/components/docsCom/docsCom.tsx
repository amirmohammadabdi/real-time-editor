"use client"
import { Cursor, Member } from "@/app/lib/interface";
import { useEffect, useRef, useState } from "react";

export default function DocsCom({ myInfo, socket}: { myInfo: Member|null, socket: any}){
    const editorRef = useRef<HTMLDivElement|null>(null)
    const [cursors, setCursors] = useState<Cursor[]>([])
    useEffect(() => {
        if(socket.current){
            socket.current.on('text-changed', (data:string) => {
                if(editorRef.current){
                    editorRef.current.innerHTML = data
                }
            })
            socket.current.on('cursor', (data:Cursor) => {
                let newCursors = cursors.filter(c => c._id!=data._id)
                newCursors.push(data)
                setCursors(newCursors)
            })
            socket.current.emit("ready-for-text")
        }
        
        return () => {
            if(socket.current){
                socket.current.off('history')
                socket.current.off('text-changed')
                socket.current.off('cursor')
            }
        }
    }, [socket.current])
    function sendText(){
        if(!editorRef.current || !socket.current) return

        socket.current.emit('text-changed', editorRef.current.innerHTML)
    }
    const sendCursor = () => {
        if(!myInfo || !editorRef.current) return
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return

        const range = sel.getRangeAt(0);
        const caretRange = range.getBoundingClientRect()
        const divRect = editorRef.current?.getBoundingClientRect()

        const relativeLeft = caretRange.left - divRect.left
        const relativeTop = caretRange.top - divRect.top

        if (!socket) return

        socket.current.emit("cursor", {
            _id: myInfo._id,
            name: myInfo.name,
            color: myInfo.color,
            x: relativeLeft+10,
            y: relativeTop+8.5
        })
    }
    return(
        <div className="in-box doc-box">
            <div className="top">document</div>
            <div className="space" style={{position: 'relative'}}>
                <div
                    ref={editorRef}
                    contentEditable
                    onKeyUp={() => { sendText(); sendCursor() }}
                    onClick={sendCursor}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        padding: 10
                    }}
                ></div>
                {
                    cursors.map(c => (
                        <div
                            key={c._id}
                            style={{
                                position: 'absolute',
                                top: c.y,
                                left: c.x,
                                background: c.color,
                                width: 2,
                                height: 20,
                                zIndex: 100
                            }}
                        ></div>
                    ))
                }
            </div>
        </div>
    )
}
