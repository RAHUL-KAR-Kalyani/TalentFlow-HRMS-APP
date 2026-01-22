const express = require('express');
const isAuth = require('../middleware/authMiddleware');
const { createLeaveRequestController, getLeaveRequestsController, getLeaveRequestsByIdController, updateLeaveRequestStatusController } = require('../controllers/leaveRequestController');


const leaveRequestRouter = express.Router();

leaveRequestRouter.post('/request-leave', isAuth, createLeaveRequestController);
leaveRequestRouter.get('/get-leave-requests', isAuth, getLeaveRequestsController);
leaveRequestRouter.get('/get-leave-request-for-admin', getLeaveRequestsController);
leaveRequestRouter.get('/get-leave-requests/:id', isAuth, getLeaveRequestsByIdController);
leaveRequestRouter.patch('/update-leave-request/:id', isAuth, updateLeaveRequestStatusController);
leaveRequestRouter.patch('/update-leave-request-by-admin-hr/:id', updateLeaveRequestStatusController);

module.exports = leaveRequestRouter;