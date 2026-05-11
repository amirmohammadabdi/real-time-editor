const Member = require('../models/roomMemberModel');
const Room = require('../models/roomModel');
const router = require('express').Router()
const bcrypt = require('bcryptjs')

router.post('/room', async (req, res) => {
    try{
        const {name, members} = req.body;
        const newRoom = new Room({name, dir: '', files: [], owner: req.user._id, folders: []})
        const insertedRoom = await newRoom.save()
        members.forEach(async(mem) => {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(mem.password, salt)
            await new Member({role: mem.role, username: mem.username, password: hash, name: mem.name, room: insertedRoom._id, in: false}).save()
        });
        res.status(201).json({message: 'created the room successfully.'})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.put('/room/:id', async (req, res) => {
    try{
        const {id} = req.params
        const { name, newMems, rmMems, changedMems} = req.body
        const room = await Room.findOneAndUpdate({_id: id, owner: req.user._id}, {$set: {name}})
        if(!room) return res.status(404).json({message: 'room not found.'})
        
        newMems.forEach((async(newMem) => {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(newMem.password, salt)
            await new Member({role: newMem.role, username:newMem.username, password:hash, name: newMem.name, room: id, in: true}).save()
        }))
        rmMems.forEach(async(mem) => {
            await Member.deleteOne({_id: mem})
        })
        changedMems.forEach(async (mem) => {
            const {name, username, _id, role} = mem
            if(mem.password){
                const {password}=mem
                if(password != ''){
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(password, salt)
                    await Member.updateOne({_id}, {$set: {role, name, username, password: hash}})
                }
            }
            else{
                await Member.updateOne({_id}, {$set: {role, name, username}})
            }
        })
        res.status(200).json({message: 'updated the room successfully.'})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/room/:id', async(req, res) => {
    const {id} = req.params
    try{
        const room = await Room.findOne({_id: id, owner: req.user._id}).select("name")
        if(!room) return res.status(404).json({message: 'room not found'});

        const members = await Member.find({room: id})

        res.status(200).json({
            message: 'fetched the room information successfully',
            members,
            room,
            err
        })
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/rooms', async(req, res) => {
    try{
        const rooms = await Room.find({owner: req.user._id}).select('name _id')
        res.status(200).json({
            message: 'fetched the rooms successfully.',
            rooms
        })
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.delete('/room/:id', async (req, res) => {
    const {id} = req.params
    try{
        await Room.deleteOne({_id: id})
        await Member.deleteMany({room: id})
        res.status(200).json({message: 'deleted the room successfully.'})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router