const userModel = require("../models/users.models")
const bcrypt = require("bcrypt")
const AppError = require("../utils/error.util")

exports.updateUser = async(userId, data) => {
    const user = await userModel.findById(userId)
    console.log("CP:",data.currentPassword);
    
    if(!user){
        throw new AppError("User not found",404)
    }

    if(data.username && data.username !== user.username){
        const existingUser = await userModel.findOne({
            username: data.username
        })

        if(existingUser){
            throw new AppError("Username already taken",400)
        }
        user.username = data.username
    }

    if(data.currentPassword && data.newPassword){
        const isMatch = await bcrypt.compare(data.currentPassword,user.password)
        if(!isMatch){
            throw new AppError("Current password is incorrect",400)
        }
        const hash = await bcrypt.hash(data.newPassword, 10)
        user.password = hash
    }

    await user.save()

    return{
        id: user._id,
        username: user.username
    }
}
