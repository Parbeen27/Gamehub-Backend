const express = require("express")
const { isAuthenticated } = require("../middleware/auth.middleware")
const { submitScore, getLeaderboard, getMyScores, getGames, getGlobalLeaderboard, getUserStats, getMyRank, addPlays } = require("../controllers/ScoreController")
const router = express.Router()



router.post("/score",
    isAuthenticated,
    submitScore
)

router.get("/score/leaderboard/:gameId",getLeaderboard)

router.get("/score/global-leaderboard",getGlobalLeaderboard)

router.get("/",getGames)

router.post("/score/my-scores",
    isAuthenticated,
    getMyScores
)

router.get("/score/user/:userId",getUserStats)

router.get("/score/my-rank/:gameId",
    isAuthenticated,
    getMyRank
)


router.post("/:slug/play",addPlays)
module.exports = router