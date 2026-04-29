const express = require('express');
const { addEmployeeController, getEmployeeController, getEmployeeControllerById, updateEmployeeController, deleteEmployeeController } = require('../controllers/employeeController');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const { updateEmployeeSchema, createEmployeeSchema } = require('../validations/employeeValidation');

const employeeRouter = express.Router();


employeeRouter.post('/register', isAuth, roleMiddleware(["Admin", "HR"]), validateMiddleware(createEmployeeSchema), addEmployeeController);
employeeRouter.get('/get-employees', isAuth, roleMiddleware(["Admin", "HR", "Employee"]), getEmployeeController);
// employeeRouter.get('/get-employee/:id', isAuth, roleMiddleware(["Admin", "HR", "Employee"]), getEmployeeControllerById);
employeeRouter.get('/get-employee/:id', isAuth, roleMiddleware(["Admin", "HR", "Employee"]), getEmployeeControllerById);
employeeRouter.patch('/update-employee/:id', isAuth, roleMiddleware(["Admin", "HR"]), validateMiddleware(updateEmployeeSchema), updateEmployeeController);
employeeRouter.delete('/delete-employee/:id', isAuth, roleMiddleware(["Admin", "HR"]), deleteEmployeeController);



module.exports = employeeRouter;