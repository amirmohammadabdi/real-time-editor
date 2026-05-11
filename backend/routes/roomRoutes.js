const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Member = require('../models/roomMemberModel')
const JWT_SECRET = process.env.JWT_SECRET

router.post('/login/:id', async(req, res) => {
    try{
        const {id} = req.params
        const {username, password} = req.body
        const member = await Member.findOne({username, room: id}).populate('room')
        if(!member) return res.status(401).json({message: 'credentials are wrong.'});
        if(member.in && member.in == true) return res.status(401).json({message: 'user already joint the room.'})
        
        const isMatch = member.comparePassword(password)
        if(!isMatch) return res.status(401).json({message: 'credentials are wrong.'});

        const payload = {
            _id: member._id,
            username: member.username,
            name: member.name,
            room: id,
            roomName: member.room.name,
            role: member.role,
            color: `rgb(${Math.random()*200}, ${Math.random()*200}, ${Math.random()*200})`
        }

        await Member.updateOne({_id: member._id}, {$set: {in: true}})

        jwt.sign(payload, JWT_SECRET, {expiresIn: '10min'}, (err, token) => {
            if(err) throw err

            res.status(200).json({message: 'joined the room successfully.', token: `Bearer ${token}`})
        })
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router