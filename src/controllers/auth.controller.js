const userModels = require("../models/users.models")
const AppError = require("../utils/error.util")
const asyncHandler = require("../middleware/async.middleware")
const jwt = require("jsonwebtoken")

const bcrypt = require("bcrypt")

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}


//User creation
exports.registerUser = asyncHandler(async (req,res)=>{
        const { username, email, password} = req.body
        const isUserAlreadyExists = await userModels.findOne({
            $or: [{ username },{email}]
        })
        if(isUserAlreadyExists){
            throw new AppError("User Already Exists",409)
        }
        const hash = await bcrypt.hash(password,10)
        const user = await userModels.create({
            username,
            email,
            password: hash,
                       
        })

        const accessToken = generateAccessToken(user)

        res.cookie("accessToken",accessToken,{
            httpOnly: true,
            secure: false, //true in production 
            sameSite: "lax"
        })


        res.status(201).json({
            message: "User Created Successfully"
        })
})

//Login Function
exports.Login = asyncHandler(async (req,res)=>{
    
        const { identifier, password} = req.body
        
        if(!identifier || !password){
            throw new AppError("Missing Fields",400)
        }

        const user = await userModels.findOne({
            $or:[{username: identifier},{email : identifier}]
        })
        if(!user){
            throw new AppError("User Not Found",404)
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        res.cookie("refreshToken",refreshToken,{
            httpOnly: true,
            secure: false, //true in production 
            sameSite: "lax"
        })

        res.status(201).json({
            message: "user successfully loggedIN",
            accessToken,
            id: user._id,
            role: user.role,
            email: user.email
        })
})

exports.checkLogin = asyncHandler(async (req,res) => {
   const authHeader = req.headers.authorization
   if(!authHeader) return res.sendStatus(401);
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
    const user = await userModels.findById(decoded.id).select('email role')
    res.json({
        loggedIn: true,
        role: user.role,
        email: user.email
    })
})


exports.refreshToken = asyncHandler((req,res) => {
    const token = req.cookies.refreshToken

    if(!token){
        throw new AppError("Not logged In",401)
    }
    
    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    const accessToken = jwt.sign(
        {id: decoded.id},
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )

    res.json({ accessToken })
})