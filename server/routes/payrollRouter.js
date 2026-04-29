const express = require('express');
const { generatePayrollController, getPayrollController, getPayrollByIDController, deletePayrollController } = require('../controllers/payrollController');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const { generatePayrollSchema } = require('../validations/payrollValidation');


const payrollRouter = express.Router();


payrollRouter.post('/generate', isAuth, roleMiddleware(["Admin", "HR"]),validateMiddleware(generatePayrollSchema) ,generatePayrollController);
// payrollRouter.post('/generate', isAuth, roleMiddleware(["Admin", "HR"]), generatePayrollController);

payrollRouter.get('/get-payroll',isAuth, roleMiddleware(["Admin", "HR"]), getPayrollController);

payrollRouter.get('/get',isAuth, roleMiddleware(["Employee"]), getPayrollController);

payrollRouter.get('/get-payroll/:id', isAuth, getPayrollByIDController);

payrollRouter.delete('/delete/:id', isAuth, roleMiddleware(["Admin", "HR"]), deletePayrollController);

module.exports = payrollRouter;