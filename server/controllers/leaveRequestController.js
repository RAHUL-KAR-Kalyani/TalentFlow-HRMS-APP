const {
    createLeaveRequestService,
    getLeaveRequestsService,
    getLeaveRequestsByIdService,
    updateLeaveRequestStatusService,
    deleteLeaveRequestService
} = require("../services/leaveRequestService");


const createLeaveRequestController = async (req, res) => {
    try {

        const { employee, type, startDate, endDate } = req.body;

        if (!employee || !type || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const result = await createLeaveRequestService({
            employee,
            type,
            startDate,
            endDate
        });

        return res.status(201).json({
            success: true,
            message: result.message,
            leaveRequest: result.leaveRequest
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const getLeaveRequestsController = async (req, res) => {
    try {

        const leaveRequests = await getLeaveRequestsService();

        return res.status(200).json({
            success: true,
            message: "Leave requests retrieved successfully",
            leaveRequests
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

const getLeaveRequestsByIdController = async (req, res) => {
    try {

        const employeeID = req.params.id;

        const leaveRequests = await getLeaveRequestsByIdService(employeeID);

        return res.status(200).json({
            success: true,
            message: "Leave requests retrieved successfully",
            leaveRequests
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

const updateLeaveRequestStatusController = async (req, res) => {
    try {

        const leaveRequestId = req.params.id;
        const updatedData = req.body;

        const updatedLeaveRequest = await updateLeaveRequestStatusService(
            leaveRequestId,
            updatedData
        );

        return res.status(200).json({
            success: true,
            message: "Leave request updated successfully",
            updatedLeaveRequest
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

const deleteLeaveRequestController = async (req, res) => {
    try {

        const leaveRequestId = req.params.id;

        await deleteLeaveRequestService(leaveRequestId);

        return res.status(200).json({
            success: true,
            message: "Leave request deleted successfully"
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
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