const express = require("express")
const { isAuthenticated } = require("../middleware/auth.middleware")
const { authorizeRoles } = require("../middleware/role.middleware")
const analystController = require("../controllers/analyst.controller")

const router = express.Router()

router.get("/dashboard",
    isAuthenticated,
    authorizeRoles("analyst","admin"),
    analystController.getDashboardStats
)

router.get("/users/growth",
    isAuthenticated,
    authorizeRoles("analyst","admin"),
    analystController.getUserGrowth
)

router.get("/games",
    isAuthenticated,
    authorizeRoles("analyst","admin"),
    analystController.getGameStats
)

router.get("/leaderboard/:gameId",
    isAuthenticated,
    authorizeRoles("analyst","admin"),
    analystController.getLeaderboard
)

router.get("/games/peaktime",
    isAuthenticated,
    authorizeRoles("analyst","admin"),
    analystController.getPeaktime
)


module.exports = router