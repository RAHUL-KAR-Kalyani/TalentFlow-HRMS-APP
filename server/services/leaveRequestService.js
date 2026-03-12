const leaveRequestModel = require("../models/leaveRequestModel");


const createLeaveRequestService = async ({ employee, type, startDate, endDate }) => {

    const pendingRequestsCount = await leaveRequestModel.countDocuments({
        employee,
        status: "Pending"
    });

    if (pendingRequestsCount >= 2) {
        throw new Error(`You have reached the limit of two pending leave requests. Current pending requests: ${pendingRequestsCount}`);
    }

    const existingPendingRequest = await leaveRequestModel.findOne({
        employee,
        status: "Pending"
    });

    const newLeaveRequest = await leaveRequestModel.create({
        employee,
        type,
        startDate,
        endDate,
        status: "Pending"
    });

    if (existingPendingRequest) {
        return {
            message: "There is already a pending leave request. Your new request has been added to the queue.",
            leaveRequest: newLeaveRequest
        };
    }

    return {
        message: "Leave request created successfully",
        leaveRequest: newLeaveRequest
    };
};


const getLeaveRequestsService = async () => {

    const leaveRequests = await leaveRequestModel
        .find()
        .populate("employee");

    if (!leaveRequests || leaveRequests.length === 0) {
        throw new Error("Leave requests not found");
    }

    return leaveRequests;
};


const getLeaveRequestsByIdService = async (employeeId) => {

    const leaveRequests = await leaveRequestModel
        .find({ employee: employeeId })
        .populate("employee");

    if (!leaveRequests || leaveRequests.length === 0) {
        throw new Error("You don't have any leave requests");
    }

    return leaveRequests;
};


const updateLeaveRequestStatusService = async (leaveRequestId, updatedData) => {

    const updatedLeaveRequest = await leaveRequestModel
        .findByIdAndUpdate(leaveRequestId, updatedData, { new: true })
        .populate("employee");

    if (!updatedLeaveRequest) {
        throw new Error("Leave request not found");
    }

    return updatedLeaveRequest;
};


const deleteLeaveRequestService = async (leaveRequestId) => {

    const leaveRequest = await leaveRequestModel.findById(leaveRequestId);

    if (!leaveRequest) {
        throw new Error("Leave request not found");
    }

    await leaveRequestModel.findByIdAndDelete(leaveRequestId);

    return true;
};


module.exports = {
    createLeaveRequestService,
    getLeaveRequestsService,
    getLeaveRequestsByIdService,
    updateLeaveRequestStatusService,
    deleteLeaveRequestService
};