const mongoose = require("mongoose")

async function connectdb(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Databases Connected Successfully");
        
    } catch (err) {
        console.error("Failed to Connect DB :",err);
        
    }
}

module.exports = connectdb