

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500

    // Dev 
    if(process.env.NODE_ENV === "development"){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack
        })
        
        
    }

    //prod
    if(err.isOperational){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
        
        
    }
    //unknown
    return res.status(500).json({
        success: false,
        message: "Something went wrong"
    })
}