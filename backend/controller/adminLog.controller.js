import AdminLog from "../models/adminlog.model.js"

/**
 * @desc Record admin activity (like status update)
 * @route POST /api/admin/logs
 * @access Private (Admin only)
 */

export const recordAdminLog = async(userId, action)=>{
    try {
        if (!userId || !action) {
      console.warn("Admin log missing userId or action:", { userId, action });
      return;
    }
        const log = new AdminLog({
            user_id : userId,
            action : action
        });
        await log.save();
        
        console.log("Admin action logged:",action);
    } catch (error) {
        console.error("Error saving admin log",error);
        
    }

}

/**
 * @desc Get all admin logs (optional endpoint)
 * @route GET /api/admin/logs
 * @access Private (Admin only)
 */

export const getAllAdminLogs = async(req,res)=>{
    try {
        const logs = await AdminLog.find({})   // find all
        .populate("user_id","name email")
        .sort({timestamp:-1});

        res.status(200).json({
            success : true,
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        console.error("Error fetching admin logs:",error);
        res.status(500).json({message:"Server error fetching admin logs."})
    }

} 
