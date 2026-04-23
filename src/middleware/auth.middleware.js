const jwt = require("jsonwebtoken")

exports.isAuthenticated = (req,res,next)=>{
    const authHeader = req.headers.authorization
    
    if(!authHeader){
        return res.status(401).json({
            message: "Not authenticated"
        })
    }
    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    

    req.user = decoded

    next();
}