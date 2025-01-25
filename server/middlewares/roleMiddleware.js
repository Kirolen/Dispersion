const jwt = require("jsonwebtoken")
const {secret} = require('../Config/config')

module.exports = function(role) {
    return function (req, res, next){
        if (req.method === "OPTIONS"){
            next()
        }
    
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token){
                return res.status(403).json({message: "The user is not authorized"})
            }
            
            const {role: userRole} = jwt.verify(token, secret)
            if (userRole !== role) {
                return res.status(403).json({ message: `Access denied: you must be a ${role}` });
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(403).json({message: "The user is not authorized"})
        }
    }
}