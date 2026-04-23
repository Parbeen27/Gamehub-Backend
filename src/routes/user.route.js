const express = require("express")
const { isAuthenticated } = require("../middleware/auth.middleware")
const userController = require("../controllers/userUpdate.controller")


const router = express.Router()



router.put(
    "/update/username",
    isAuthenticated,
    userController.updateProfile
)
router.put(
    "/update/password",
    isAuthenticated,
    userController.updatePassword
)
router.get(
    "/me",
    isAuthenticated,
    userController.getUser
)




module.exports = router