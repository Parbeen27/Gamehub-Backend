const adminService = require("../services/admin.service")
const userModel = require("../models/users.models")
const asyncHandler = require("../middleware/async.middleware")
const Score = require("../models/score.model")
const Game = require("../models/game.model")
const ActivityLog = require("../models/activitylog.model")
const AppError = require("../utils/error.util")

exports.getUsers = asyncHandler(async (req,res) => {
    const users = await adminService.getAllUsers(req.query)
    res.json(users)
})

exports.getGames = asyncHandler(async (req,res) => {
    const games = await adminService.getAllGames(req.query)
    res.json(games)
})

exports.toggleBlockUser = asyncHandler(async (req,res) => {
    
        const adminId = req.user.id
        
        const userId = req.params.id
        const user =  await adminService.toggleBlockUser(adminId, userId)
        
        if(!user){
            throw new AppError("User not Found",404)
        }
        res.json({
            message: "User status update",
            user: user
        })
    
})

exports.deleteUser = asyncHandler(async (req,res) => {
    
        const adminId  = req.user.id
        const userId = req.params.id

        const user = await adminService.deleteUser(adminId,userId)

        if(!user){
            throw new AppError("User not found",404)
        }
        res.json({
            message: "User status update",
            user: updateUser
        })
    
})

exports.changeUserRole = asyncHandler(async (req,res) => {
    const adminId = req.user.id
    const userId = req.params.id
    const { role } = req.body

    const updateUser = await adminService.changeUserRole(
        adminId,
        userId,
        role
    )
    res.json({
        message: "Role updated successfully",
        user: updateUser
    })
})

exports.createGame = asyncHandler(async (req,res) => {
    const adminId = req.user.id

    const game = await adminService.createGame(adminId, req.body,req.file)

    res.status(201).json({
        message: "Game Added Successfully",
        game
    })
})

exports.getGameStats = asyncHandler(async (req, res) => {
  const stats = await Game.aggregate([
    {
      $lookup: {
        from: "scores",
        localField: "_id",
        foreignField: "gameId",
        as: "scores"
      }
    },
    {
      $project: {
        name: 1,
        totalPlays: { $size: "$scores" },
        avgScore: { $avg: "$scores.score" },
        bestScore: { $max: "$scores.score" },
        uniquePlayers: {
          $size: {
            $setUnion: ["$scores.userId"]
          }
        },
        lastPlayed: { $max: "$scores.createdAt" }
      }
    },
    {
      $sort: { totalPlays: -1 }
    }
  ]);

  res.json(stats);
});

exports.getUserStats = asyncHandler(async (req, res) => {
    const totalUsers = await userModel.countDocuments()
    const totalGames = await Game.countDocuments()
    
    const activeUsers = await userModel.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })

  
    const blockedUsers = await userModel.countDocuments({
      isBlocked: true
    })
  
    res.json({
      totalUsers,
      totalGames,
      activeUsers,
      blockedUsers
    })
})

exports.toggleGame = asyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id);
    
    game.isActive = !game.isActive;
    await game.save();
    
    res.json({
      message: "Game status updated",
      isActive: game.isActive
    });
});

exports.getActivityLogs = asyncHandler(async (req,res) => {
    const logs = await ActivityLog.find()
    .populate("performedBy","username email")
    .populate("targetUser", "username email")
    .sort({ createdAt: -1})

    res.status(200).json(logs)
})

exports.getUserActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      targetUser: req.params.id,
    })
      .populate("performedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user logs" });
  }
};



