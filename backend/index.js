const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const socketio = require('socket.io')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI).then(() => {
    console.log('connected to mongodb.')
}).catch((err) => {
    console.log(err.message)
})

const authRoutes = require('./routes/authRoutes')
const authMiddleWare = require('./middleware/authmiddleware')
const userRoutes = require('./routes/userRoutes')
const roomRoutes = require('./routes/roomRoutes')

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/auth', authRoutes);
app.use('/user', authMiddleWare, userRoutes);
app.use('/room', roomRoutes)

app.get('/userState', authMiddleWare, (req, res) => {
    res.status(200).json({user: req.user});
})

const expressServer = app.listen(9000, ()=>{
    console.log("listening on port 9000:")
})

const io = socketio(expressServer, {
    cors: {
        origin: 'http://localhost:3000',
        method: ['GET', 'POST']
    }
})

const JWT_SECRET = process.env.JWT_SECRET
let rooms = []
io.use((socket, next) => {
    try{
        let token = socket.handshake.auth.token
        if(token && token.startsWith('Bearer')){
            token = token.split('Bearer ')[1]
            const decoded = jwt.verify(token, JWT_SECRET)
            rooms.forEach(r => {
                if(r.room == decoded.room){
                    if(r.userAlreadyIn(decoded._id)){
                        throw new Error('this user already entered the room.')
                    }
                }
            })
            socket.user = decoded
            next()
        }
        else{
            throw new Error('not authorized.')
        }
    }
    catch(err){
        console.log(err)
    }
})

const RoomClass = require('./lib/roomClass')
const Room = require('./models/roomModel')
const Member = require('./models/roomMemberModel')

io.on('connection', async (socket) => {
    let wasCreated = false
    let myRoom
    rooms.forEach(room => {
        // console.log(room.room, socket.user.room)
        if(room.room == socket.user.room){
            wasCreated = true
            room.addUser(socket.user)
            myRoom = room
        }
    })
    if(!wasCreated){
        myRoom = new RoomClass(socket.user)
        rooms.push(myRoom)
        let info = await Room.findById(socket.user.room)
        // console.log(info)
        myRoom.files = info.files
        myRoom.folders = info.folders
    }

    socket.on('disconnect', async() => {
        myRoom.removeUser(socket.user._id)
        await Member.updateOne({_id: socket.user._id}, {$set: {in: false}})
        if(myRoom.getUsers().length == 0){
            await Room.updateOne({_id: myRoom.room}, {$set: {files: myRoom.files, folders: myRoom.folders}})
            rooms = rooms.filter(room => room.room != myRoom.room)
        }
        io.to(myRoom.room).emit('users', myRoom.getUsers())
    })

    socket.on('text-changed', (data) => {
        socket.broadcast.emit("text-changed", data)
        myRoom.changeFile(data)
    })

    socket.on('cursor', (data) => {
        socket.broadcast.emit("cursor", data)
    })

    socket.on('new-file', (data) => {
        socket.broadcast.emit('new-file', data)
        myRoom.addFile(data)
    })
    socket.on('new-folder', (data) => {
        socket.broadcast.emit('new-folder', data)
        // console.log(data)
        myRoom.addFolder(data)
    })

    socket.on('del-file', (data) => {
        let state = myRoom.delFile(data)
        io.to(myRoom.room).emit('del-file', data)
        if(state)
            io.to(myRoom.room).emit('select-file', myRoom.selected)
    })
    socket.on('del-folder', (data) => {
        myRoom.delFolder(data)
        io.to(myRoom.room).emit('del-folder', data)
        io.to(myRoom.room).emit('select-file', myRoom.selected)
    })

    socket.on('select-file', data => {
        if(myRoom.selected == data) return
        myRoom.selected = data
        let isTrueId = false
        myRoom.files.forEach(f => {
            if(f._id == data){
                isTrueId = true
            }
        })
        if(isTrueId){
            socket.broadcast.emit('select-file', data)
            socket.emit('text-changed', myRoom.getFile())
        }
        else{
            socket.emit('text-changed', myRoom.getFile())
        }
    })
    socket.on('ready-for-text', () => {
        socket.emit('text-changed', myRoom.getFile())
    })


    socket.on('ready-for-history', () => {
        socket.emit('history', myRoom.getHistory())
    })

    socket.join(myRoom.room)
    socket.emit('start', socket.user)
    io.to(myRoom.room).emit("users", myRoom.getUsers())
    socket.emit("history", myRoom.getHistory())
    socket.on('got-history', ()=>{
        socket.emit('text-changed', myRoom.getFile())
    })
})