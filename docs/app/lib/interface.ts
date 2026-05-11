export interface Payload {
    username: string,
    name: string,
    _id: string
}

export interface Room{
    _id: string,
    name: string,
    owner?: string,
    dir?: string,
    files?: [string]
}

export enum Role{
    admin='admin',
    member="member"
}
export interface Member{
    _id: string
    username: string,
    name: string,
    password?: string,
    room?: string,
    roomName?: string,
    role: Role,
    old?: boolean,
    color?: string
}

export interface Cursor{
    color: string,
    _id: string,
    name: string,
    y: number,
    x: number
}

export interface Folder{
    _id: string,
    name: string
    folder: string
}
export interface FileInterface{
    _id: string,
    name: string,
    folder: string,
    body: string
}