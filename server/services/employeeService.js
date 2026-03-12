/** @type {import('mongoose').Model<any>} */
const employeeModel = require("../models/employeeModel");


const addEmployeeService = async (employeeData) => {

    const { email } = employeeData;
    const existingEmployee = await employeeModel.findOne({ email });
    if (existingEmployee) {
        throw new Error("Employee already exists");
    }

    const newEmployee = await employeeModel.create(employeeData);
    return newEmployee;
};



const getEmployeeService = async () => {

    const employees = await employeeModel.find();
    if (!employees || employees.length === 0) {
        throw new Error("Employees not found");
    }

    return employees;
};



const getEmployeeByIdService = async (employeeId) => {

    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
        throw new Error("Employee not found");
    }

    return employee;
};



const updateEmployeeService = async (employeeId, updatedDetails) => {

    const updatedEmployee = await employeeModel.findByIdAndUpdate(employeeId, updatedDetails, { new: true });
    if (!updatedEmployee) {
        throw new Error("Employee not found");
    }

    return updatedEmployee;
};



const deleteEmployeeService = async (employeeId) => {

    const deletedEmployee = await employeeModel.findByIdAndDelete(employeeId);
    if (!deletedEmployee) {
        throw new Error("Employee not found");
    }

    return true;
};


module.exports = {
    addEmployeeService,
    getEmployeeService,
    getEmployeeByIdService,
    updateEmployeeService,
    deleteEmployeeService
};