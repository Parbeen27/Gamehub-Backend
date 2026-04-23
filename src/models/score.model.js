const mongoose = require("mongoose")


const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    duration: {
        type: Number
    },
    isHighScore: {
        type: Boolean,
        default: false
    },
    playedAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

module.exports = mongoose.model("Score",scoreSchema)