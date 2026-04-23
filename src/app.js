const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const adminRoutes = require("./routes/admin.routes")
const analystRoutes = require("./routes/analyst.routes")
const gameRoutes = require("./routes/game.routes")
const errorMiddleware = require("./middleware/error.middleware")
const userRoutes = require("./routes/user.route")
const app = express()
app.use(cors({
    origin: 'https://game-hub-navy-zeta.vercel.app',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/analyst",analystRoutes)
app.use("/api/user",userRoutes)
app.use("/api/games",gameRoutes)
app.use(errorMiddleware)

module.exports = app