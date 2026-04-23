const userModel = require("../models/users.models")
const Score = require("../models/score.model")
const mongoose = require("mongoose")

exports.getDashboardStats = async() => {
    const totalUsers = await userModel.countDocuments({
        isDeleted: false
    })
    const activeUsers = await userModel.countDocuments({
        lastLogin: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
    })

    const totalGamesPlayed = await Score.countDocuments()

    const topGame = await Score.aggregate([
        {
            $group: {
                _id: "$gameId",
                plays: { $sum: 1 }
            }
        },
        { $sort: { plays: -1 }},
        { $limit: 1 }
    ])

    return {
        totalUsers,
        activeUsers,
        totalGamesPlayed,
        topGame
    }
}

exports.getUserGrowth = async () => {
    return await userModel.aggregate([
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

exports.getGameStats = async () => {
    return await Score.aggregate([
        {
            $group: {
                _id: "$gameId",
                totalPlays: { $sum: 1 },
                avgScore: { $avg: "$score" },
                maxScore: { $max: "$score" }
            }
        },
        { $sort: { totalPlays: -1 } }
    ]);
};

exports.getLeaderboard = async (gameId) => {
    return await Score.aggregate([
        { $match: { gameId: new mongoose.Types.ObjectId(gameId) } },
        {
            $group: {
                _id: "$userId",
                bestScore: { $max: "$score" }
            }
        },
        { $sort: { bestScore: -1 } },
        { $limit: 10 }
    ]);
};

exports.getPeakHours = async () => {
    return await Score.aggregate([
        {
            $group: {
                _id: { $hour: "$playedAt" },
                plays: { $sum: 1 }
            }
        },
        { $sort: { plays: -1 } }
    ]);
};