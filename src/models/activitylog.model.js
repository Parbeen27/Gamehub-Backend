const mongoose = require("mongoose")


const activityLogSchema = new mongoose.Schema({
    action: String,
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    targetUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    details: Object
},
{
    timestamps: true
})


module.exports = mongoose.model("ActivityLog",activityLogSchema)