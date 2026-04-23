const User = require("../models/users.models")
const Game = require("../models/game.model")
const ActivityLog = require("../models/activitylog.model")
const AppError = require("../utils/error.util")
const cloudinary  = require("../config/cloudinary")
const streamifier = require("streamifier")


exports.getAllUsers = async (query) => {
    const { page = 1, limit = 50} = query

    return await User.find({
        isDeleted: false
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-password")
}
exports.getAllGames = async (query) => {
    const { page = 1, limit = 10} = query

    return await Game.find({
        isActive: true
    })
    .skip((page - 1) * limit)
    .limit(limit)
}

exports.toggleBlockUser = async (adminId, userId) => {
    const user = await User.findById(userId)

    if(!user) return null;

    user.isBlocked = !user.isBlocked

    await user.save()

    return user
}

exports.changeUserRole = async (adminId, userId, newRole) => {
    const adminsCount = await User.countDocuments({role: "admin"})

    const allowedRoles = ["user","admin","analyst"]

    if(!allowedRoles.includes(newRole)){
        throw new AppError("Invalid role",400)
    }
    const user = await User.findById(userId)

    if(user.role === "admin" && newRole !== "admin" && adminsCount <= 1){
        throw new AppError("Cannot remove last admin", 400)
    }
    if(!user){
        throw new AppError("User not found", 404)
    }

    if(adminId === userId){
        throw new AppError("You cannot change your own role", 400)
    }
    user.role = newRole;
    await user.save()

    return user
}

exports.deleteUser = async (adminId, userId) => {
    const user = await User.findById(userId)
    //const user = await User.findByIdAndDelete(userId)

    if(!user) return null;

    user.isDeleted = true
    await user.save()

    return user
}

exports.createGame = async (adminId, data, file) => {
    const { name,scenekey,description,genre } = data
    
    const existingGame = await Game.findOne({ name })

    if(existingGame){
        throw new AppError("Game already exists", 400)
    }

    const slug = name.toLowerCase().replace(/\s+/g,"-")

    let thumbnailUrl = "";
    
    if (file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "game-thumbnails" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
    
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    
      thumbnailUrl = result.secure_url;
    }

    const game = await Game.create({
        name,
        slug,
        scenekey,
        description,
        genre,
        thumbnail: thumbnailUrl
    })

    return game
}