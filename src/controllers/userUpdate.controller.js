const asyncHandler = require("../middleware/async.middleware")
const AppError = require("../utils/error.util")
const userService = require("../services/user.service")
const userModel = require("../models/users.models")

exports.updateProfile = asyncHandler(async(req,res) => {
    const userId = req.user.id

    const { username } = req.body

    const updateUser = await userService.updateUser(userId,{
        username,
    })

    res.json({
        message: "Username update successfully",
        username: updateUser.username
    })
})

exports.updatePassword = asyncHandler(async(req,res)=>{
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

    const updateUser = await userService.updateUser(userId,{
        currentPassword,
        newPassword
    })

    res.json({
        message: "Password updated successfully",
        username: updateUser
    })
})

exports.getUser = asyncHandler(async(req,res) => {
    const user = await userModel.findById(req.user.id).select("-password") 

    res.json({
        loggedIn: true,
        id:user._id,
        username: user.username,
        email: user.email,
        role: user.role
    })
})

