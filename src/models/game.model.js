const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true
    },
    scenekey: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    genre: {
        type: String,
        enum: ["arcade","puzzle","action","strategy"],
        required: true
    },
    thumbnail:{
        type:String
    },
    plays: {
        type: Number,
        default: 0
    },

    uniquePlayers: {
        type: Number,
        default: 0
    },
    isActive:{
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},{ timestamps: true })


module.exports = mongoose.model("Game", gameSchema)