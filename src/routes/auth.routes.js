const express = require("express")
const { registerUser, Login, checkLogin, refreshToken } = require("../controllers/auth.controller")
const { isAuthenticated } = require("../middleware/auth.middleware")

const router = express.Router()



router.post("/register",registerUser)
router.post("/login",Login)
router.get("/checklogin",checkLogin)
router.post("/refresh",refreshToken)
module.exports = router