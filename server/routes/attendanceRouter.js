const express = require('express');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { markAttendanceController, getAttendanceController, getAttendanceControllerById, updateAttendanceController, getAttendanceControllerByEmployeeId } = require('../controllers/attendanceController');
const validateMiddleware = require('../middleware/validateMiddleware');
const { markAttendanceSchema, updateAttendanceSchema } = require('../validations/attendanceValidation');


const attendanceRouter = express.Router();

attendanceRouter.post('/mark-attendance', isAuth, roleMiddleware(["Admin", "HR", "Employee"]), validateMiddleware(markAttendanceSchema), markAttendanceController);
attendanceRouter.get('/get-attendance', isAuth, roleMiddleware(["Admin", "HR", "Employee"]), getAttendanceController);
attendanceRouter.get('/get-attendance-for-admin-hr', isAuth, roleMiddleware(["Admin", "HR"]), getAttendanceController);
attendanceRouter.get('/get-attendance/:id', isAuth, getAttendanceControllerById);
attendanceRouter.get('/get-attendance-by-employee/:id', isAuth, getAttendanceControllerByEmployeeId);
attendanceRouter.patch('/update-attendance/:id', isAuth, validateMiddleware(updateAttendanceSchema), updateAttendanceController);


module.exports = attendanceRouter;