
const asyncHandler = require("../middleware/async.middleware")
const analystService = require("../services/analytics.service")


exports.getDashboardStats = asyncHandler(async(req,res)=>{
    const data = await analystService.getDashboardStats()

    res.json({
        success: true,
        data
    })
})

exports.getUserGrowth = asyncHandler(async(req,res)=>{
    const data = await analystService.getUserGrowth()

    res.json({
        success: true,
        data
    })
})

exports.getGameStats = asyncHandler(async(req,res)=>{
    const data = await analystService.getGameStats()

    res.json({
        success: true,
        data
    })
})

exports.getLeaderboard = asyncHandler(async(req,res)=>{
    const { gameId } = req.params
    
    const data = await analystService.getLeaderboard(gameId)

    res.json({
        success: true,
        data
    })
})

exports.getPeaktime = asyncHandler(async(req,res)=>{
    const data = await analystService.getPeakHours()

    res.json({
        success: true,
        data
    })
})