const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET
const expiresIn = process.env.EXPIRSES_IN

router.post('/register', async(req, res) => {
    const {username, password} = req.body;
    try{
        const userExists = await User.findOne({username});
        if(userExists){
            return res.status(401).json({message: "username already exists."})
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hash
        })

        await newUser.save()

        res.status(201).json({message: 'you registered successfully.'})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username})
        if(!user){
            return res.status(401).json({message: "credentials are wrong."})
        }
        
        const isMatch = user.comparePassword(password)

        if(!isMatch){
            return res.status(401).json({message: "credentials are wrong."})
        }

        const payload = {
            username,
            _id: user._id,
            name: user.name
        }

        jwt.sign(payload, JWT_SECRET, {expiresIn}, (err, token) => {
            if(err){
                throw err
            }
            res.status(200).json({
                message: "you logged in successfully.",
                token: `Bearer ${token}`,
                payload
            })
        })
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router