const Score = require("../models/score.model")
const Games = require("../models/game.model")
const mongoose = require("mongoose")
const AppError = require("../utils/error.util")
const asyncHandler = require("../middleware/async.middleware")

exports.getGames = async (req,res) => {
    const games = await Games.find({ isActive: true })
    if(!games){
        throw new AppError("No games found",401)
    }
    res.json(games)
}

exports.submitScore =asyncHandler (async (req, res) => {
    const { gameId, score } = req.body;
    const userId = req.user.id;    
    // check if user already played this game
    const existing = await Score.findOne({ userId, gameId });    
    const newScore = await Score.create({
      userId,
      gameId,
      score,
      isHighScore: !existing || score > existing.score
    });    
    // increment total plays
    await Game.findByIdAndUpdate(gameId, {
      $inc: { plays: 1 }
    });    
    // increment unique players only once
    if (!existing) {
      await Game.findByIdAndUpdate(gameId, {
        $inc: { uniquePlayers: 1 }
      });
    }    
    res.json({
      message: "Score saved",
      newScore
    });
})

exports.getGlobalLeaderboard = async (req, res) => {
  const leaderboard = await Score.aggregate([
    {
      $group: {
        _id: {
          user: "$userId",
          game: "$gameId"
        },
        bestScore: { $max: "$score"}
      }
    },{
      $sort: { bestScore: -1 }
    },{
      $limit: 100
    },{
      $lookup: {
        from: "users",
        localField: "_id.user",
        foreignField: "_id",
        as: "user"
      }
    },{
      $unwind: "$user"
    },
    {
      $lookup: {
        from: "games",
        localField: "_id.game",
        foreignField: "_id",
        as: "game"
      }
    },
    { $unwind: "$game"},
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        username: "$user.username",
        gameName: "$game.name",
        score: "$bestScore"
      }
    }
  ]);
  res.json(leaderboard);
};

exports.getLeaderboard = async (req, res) => {
    const { gameId } = req.params;
    
    const leaderboard = await Score.aggregate([
        {
          $match: { gameId: new mongoose.Types.ObjectId(gameId) }
        },
        {
          $group: {
            _id: {
              user: "$userId",
              game: "$gameId"
            },
            bestScore: { $max: "$score" }
          }
        },
        {
          $sort: { bestScore: -1 }
        },
        {
          $limit: 10
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.user",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "games",
            localField: "_id.game",
            foreignField: "_id",
            as: "game"
          }
        },
        { $unwind: "$game" },
        {
          $project: {
            _id: 0,
            userId: "$user._id",
            username: "$user.username",
            gameName: "$game.name",
            score: "$bestScore"
          }
        }
  ]);

  res.json(leaderboard);
};

exports.getMyScores = async (req,res) => {
    const scores = await Score.find({ userId: req.user.id })
    .populate("gameId", "name")
    .sort({ score: -1 });
    if(!scores){
        throw new AppError("Error fetching data",500)
    }

    res.json(scores)
}

exports.getUserStats = async (req,res) => {
    const scores = await Score.find({ userId: req.params.userId })
    .populate("gameId", "name");
    
    const totalGames = scores.length
    const bestScore = Math.max(...scores.map(s => s.score), 0);

    res.json({
        totalGames,
        bestScore,
        scores
    })
}

exports.addPlays = asyncHandler(async (req,res) => {
  const game = await Games.findOneAndUpdate(
    {slug: req.params.slug},
    { $inc: { plays: 1}},
    { new: true}
  )
  if(!game){
    throw new AppError("Game not found",404)
  }

  res.status(200).json({
    message: "Play count updated",
    plays: game.plays
  })
})

exports.getMyRank = async (req, res) => {
    if(!req.user){
        throw new AppError("Unauthorized",401)
    }
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const { gameId } = req.params;

  const matchStage = gameId
    ? { gameId: new mongoose.Types.ObjectId(gameId) }
    : {};

  const leaderboard = await Score.aggregate([
    { $match: matchStage },

    // best score per user
    {
      $group: {
        _id: "$userId",
        bestScore: { $max: "$score" }
      }
    },

    // sort descending
    { $sort: { bestScore: -1 } },

    // add rank
    {
      $setWindowFields: {
        sortBy: { bestScore: -1 },
        output: {
          rank: { $rank: {} }
        }
      }
    },

    // find current user
    {
      $match: {
        _id: userId
      }
    }
  ]);

  if (!leaderboard.length) {
    return res.json({ rank: null, score: 0 });
  }

  res.json({
    rank: leaderboard[0].rank,
    score: leaderboard[0].bestScore
  });
};

