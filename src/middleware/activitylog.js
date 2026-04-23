const ActivityLog = require("../models/activitylog.model")
exports.logAdminAction = (action) => {
    return async (req, res, next) => {
        res.on("finish", async () => {
            if (res.statusCode < 400) {
                console.log(req.user.id);
                
                await ActivityLog.create({
                    action,
                    performedBy: req.user.id,
                    targetUser: req.params.id,
                    details: req.body || {}
                });
            }
        });

        next();
    };
};