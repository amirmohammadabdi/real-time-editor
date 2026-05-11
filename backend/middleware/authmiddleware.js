const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const protect = (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split('Bearer ')[1]

            const decoded = jwt.verify(token, JWT_SECRET)

            req.user = decoded

            next()
        }
        catch(err){
            res.status(500).json({message: err.message})
        }
    }

    if(!token){
        res.status(401).json({message: "you need to provide us with a token"})
    }
}

module.exports = protect