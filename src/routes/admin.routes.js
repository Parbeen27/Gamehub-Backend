const express = require("express")
const router = express.Router()

const { isAuthenticated } = require("../middleware/auth.middleware")
const { authorizeRoles } = require("../middleware/role.middleware")

const adminContoller = require("../controllers/admin.controller")
const { logAdminAction } = require("../middleware/activitylog")
const upload  = require("../middleware/upload")

router.get("/users",
    isAuthenticated,
    authorizeRoles("admin"),
    adminContoller.getUsers
)
router.patch("/users/block/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    logAdminAction("BLOCK_TOGGLE"),
    adminContoller.toggleBlockUser
)

router.patch("/users/delete/:id/",
    isAuthenticated,
    authorizeRoles("admin"),
    logAdminAction("DELETE_USER"),
    adminContoller.deleteUser
)

router.patch("/users/role/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    logAdminAction("USER_ROLE_CHANGE"),
    adminContoller.changeUserRole
)

router.post("/create/games",
    isAuthenticated,
    authorizeRoles("admin"),
    logAdminAction("ADD_GAME_DATA"),
    upload.single("thumbnail"),
    adminContoller.createGame
)

router.get("/stats/games",
    isAuthenticated,
    authorizeRoles("admin"),
    adminContoller.getGameStats
)

router.get("/stats/users",
    isAuthenticated,
    authorizeRoles("admin"),
    adminContoller.getUserStats
)
router.get("/games", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    adminContoller.getGames
    );


router.patch("/games/:id/toggle", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    adminContoller.toggleGame);

router.get("/",
    isAuthenticated,
    authorizeRoles("admin"),
    adminContoller.getActivityLogs
)

router.get("/user/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    adminContoller.getUserActivityLogs
)




module.exports = router