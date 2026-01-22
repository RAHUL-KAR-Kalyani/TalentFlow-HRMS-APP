const express = require('express');
const { generatePayrollController, getPayrollController, getPayrollByIDController, deletePayrollController } = require('../controllers/payrollController');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


const payrollRouter = express.Router();
// payroll will generate only after salary credited
payrollRouter.post('/generate', isAuth, generatePayrollController);

// HR/ADMIN can view own payroll only after payroll generated
payrollRouter.get('/get-payroll',isAuth, roleMiddleware(["Admin", "HR"]), getPayrollController);

// Employee can view all payroll after payroll generated
payrollRouter.get('/get',isAuth, roleMiddleware(["Employee"]), getPayrollController);

// employee can view own payroll only after payroll generated
payrollRouter.get('/get-payroll/:id', isAuth, getPayrollByIDController);

payrollRouter.delete('/delete/:id', isAuth, roleMiddleware(["Admin", "HR"]), deletePayrollController);

module.exports = payrollRouter;