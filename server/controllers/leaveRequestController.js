const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const leaveRequestModel = require("../models/leaveRequestModel");
/** @type {import('mongoose').Model<any>} */

// createLeaveRequest
// getLeaveRequest (HR/Admin)
// getLeaveRequestbyemployeeId
// updateLeaveRequest status (approves/rejects.) (HR/Admin only)


const createLeaveRequestController = async (req, res) => {
    try {
        const { employee, type, startDate, endDate } = req.body;

        if (!employee || !type || !startDate || !endDate) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const pendingRequestsCount = await leaveRequestModel.countDocuments({ employee, status: "Pending" });

        if (pendingRequestsCount >= 2) {
            return res.status(400).json({
                message: `You have reached the limit of two pending leave requests. Current pending requests: ${pendingRequestsCount}`,
                pendingRequestsCount,
                success: false
            });
        }


        // if there is already pending leave request for same employee then add new request in queue
        const existingPendingRequest = await leaveRequestModel.findOne({ employee, status: "Pending" });

        if (existingPendingRequest) {
            const newLeaveRequest = await leaveRequestModel.create({ employee, type, startDate, endDate, status: "Pending" });

            return res.status(201).json({
                message: "There is already a pending leave request. Your new request has been added to the queue.",
                newLeaveRequest,
                success: true
            });
        }


        const leaveRequest = await leaveRequestModel.create({ employee, type, startDate, endDate, status: "Pending" });

        return res.status(201).json({
            message: "Leave request created successfully",
            leaveRequest,
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
};

const getLeaveRequestsController = async (req, res) => {
    try {
        const leaveRequests = await leaveRequestModel.find().populate("employee");
        if (!leaveRequests || leaveRequests.length === 0) {
            return res.status(404).json({
                message: "Leave requests not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Leave requests retrieved successfully",
            leaveRequests,
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
};

const getLeaveRequestsByIdController = async (req, res) => {
    try {
        // const leaveRequestId = req.params.id;
        const employeeID = req.params.id;
        const leaveRequests = await leaveRequestModel.find({employee:employeeID}).populate("employee");
        // const leaveRequest = await leaveRequestModel.findById(leaveRequestId).populate("employee");

        if (!leaveRequests || leaveRequests.length === 0) {
            return res.status(404).json({
                message: "You don't have any leave requests",
                success: false
            });
        }
        return res.status(200).json({
            message: "Leave requests retrieved successfully",
            leaveRequests,
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
};

const updateLeaveRequestStatusController = async (req, res) => {
    try {
        const leaveRequestId = req.params.id;
        const updatedData = req.body;        

        const updatedLeaveRequest = await leaveRequestModel.findByIdAndUpdate(leaveRequestId, updatedData, { new: true }).populate("employee");

        if (!updatedLeaveRequest) {
            return res.status(404).json({
                message: "Leave request not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Leave request updated successfully",
            updatedLeaveRequest,
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
};

const deleteLeaveRequestController = async (req, res) => {
    try {
        const leaveRequestId = req.params.id;

        const leaveRequest = await leaveRequestModel.findById(leaveRequestId);

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found",
                success: false
            });
        }

        await leaveRequestModel.findByIdAndDelete(leaveRequestId);

        return res.status(200).json({
            message: "Leave request deleted successfully",
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
};

module.exports = {
    createLeaveRequestController,
    getLeaveRequestsController,
    getLeaveRequestsByIdController,
    updateLeaveRequestStatusController,
    deleteLeaveRequestController,
};