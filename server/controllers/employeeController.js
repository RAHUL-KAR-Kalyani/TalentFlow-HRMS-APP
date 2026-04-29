const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    addEmployeeService,
    getEmployeeService,
    getEmployeeByIdService,
    deleteEmployeeService,
    updateEmployeeService
} = require("../services/employeeService");


const addEmployeeController = async (req, res) => {
    try {

        const { name, email, department, designation, role, employment_type, joiningDate, salary } = req.body;

        // if (!name || !email || !department || !designation || !role || !employment_type) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "All fields are required"
        //     });
        // }

        const employee = await addEmployeeService({
            name,
            email,
            department,
            designation,
            role,
            employment_type,
            joiningDate,
            salary
        });

        return res.status(201).json({
            success: true,
            message: "Employee added successfully",
            employee
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


const getEmployeeController = async (req, res) => {
    try {

        const employees = await getEmployeeService();

        return res.status(200).json({
            success: true,
            message: "Employees retrieved successfully",
            employees
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};


const getEmployeeControllerById = async (req, res) => {
    try {

        const employeeId = req.params.id;

        const employee = await getEmployeeByIdService(employeeId);

        return res.status(200).json({
            success: true,
            message: "Employee retrieved successfully",
            employee
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};


const updateEmployeeController = async (req, res) => {
    try {

        const employeeId = req.params.id;
        const updatedDetails = req.body;

        const employee = await updateEmployeeService(employeeId, updatedDetails);

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};


const deleteEmployeeController = async (req, res) => {
    try {

        const employeeId = req.params.id;

        await deleteEmployeeService(employeeId);

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    addEmployeeController,
    getEmployeeController,
    getEmployeeControllerById,
    updateEmployeeController,
    deleteEmployeeController
};