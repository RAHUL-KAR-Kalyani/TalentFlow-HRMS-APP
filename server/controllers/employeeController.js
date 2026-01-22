const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/** @type {import('mongoose').Model<any>} */
const employeeModel = require("../models/employeeModel");



const addEmployeeController = async (req, res) => {
    try {
        const { name, email, department, designation, role, employment_type, joiningDate, salary } = req.body;

        if (!name || !email || !department || !designation || !role || !employment_type) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingEmployee = await employeeModel.findOne({ email });
        if (existingEmployee) {
            return res.status(409).json({
                message: "Employee already exists",
                success: false
            });
        }

        // Create a new employee
        const newEmployee = await employeeModel.create({ name, email, department, designation, role, employment_type, joiningDate, salary });

        return res.status(201).json({
            message: "Employee added successfully",
            success: true,
            employee: newEmployee
        });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const getEmployeeController = async (req, res) => {
    try {
        const employees = await employeeModel.find();

        if (!employees) {
            console.log('employees not found');
            return res.status(404).json({
                message: "employees not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Employees retrieved successfully",
            success: true,
            employees
        });
    } catch (error) {
        console.error("Error retrieving employees:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const getEmployeeControllerById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await employeeModel.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                message: "Your employment record not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Employee retrieved successfully",
            success: true,
            employee
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            success: false
        });
    }
}

const updateEmployeeController = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const updatedDetails = req.body;
        // const { department, role, salary } = req.body;
        const updatedEmployee = await employeeModel.findByIdAndUpdate(employeeId, updatedDetails, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({
                message: "Employee not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Employee updated successfully",
            success: true,
            employee: updatedEmployee
        });

    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const deleteEmployeeController = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const deletedEmployee = await employeeModel.findByIdAndDelete(employeeId);
        if (!deletedEmployee) {
            return res.status(404).json({
                message: "Employee not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Employee deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({
            message: error,
            success: false
        });
    }
}


module.exports = {
    addEmployeeController,
    getEmployeeController,
    getEmployeeControllerById,
    updateEmployeeController,
    deleteEmployeeController
};