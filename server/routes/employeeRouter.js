const express = require('express');
const { addEmployeeController, getEmployeeController, getEmployeeControllerById, updateEmployeeController, deleteEmployeeController } = require('../controllers/employeeController');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');



const employeeRouter = express.Router();

employeeRouter.post('/register', isAuth, roleMiddleware(["Admin", "HR"]), addEmployeeController);
employeeRouter.get('/get-employees', isAuth, roleMiddleware(["Admin", "HR", "Employee"]), getEmployeeController);
// employeeRouter.get('/get-employee/:id', isAuth, roleMiddleware(["Admin", "HR", "Employee"]), getEmployeeControllerById);
employeeRouter.get('/get-employee/:id', isAuth, roleMiddleware(["Admin", "HR", "Employee"]), getEmployeeControllerById);
employeeRouter.patch('/update-employee/:id', isAuth, roleMiddleware(["Admin", "HR"]), updateEmployeeController);
employeeRouter.delete('/delete-employee/:id', isAuth, roleMiddleware(["Admin", "HR"]), deleteEmployeeController);


// employeeRouter.post('/register', isAuth, addEmployeeController);
// employeeRouter.get('/get-employees', isAuth, getEmployeeController);
// employeeRouter.get('/get-employee/:id', isAuth, getEmployeeControllerById);
// employeeRouter.patch('/update-employee/:id', isAuth, updateEmployeeController);
// employeeRouter.delete('/delete-employee/:id', isAuth, deleteEmployeeController);

module.exports = employeeRouter;